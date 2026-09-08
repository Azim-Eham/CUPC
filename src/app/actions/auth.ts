"use server";

import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";
import { sendAdminNotification } from "@/lib/email";
import bcrypt from "bcryptjs";
import * as z from "zod";

export async function registerUser(data: z.infer<typeof registerSchema>) {
  try {
    const validatedData = registerSchema.parse(data);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return { error: "A user with this email already exists." };
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create user with PENDING status
    await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        passwordHash: hashedPassword,
        role: validatedData.role,
        department: validatedData.department,
        phone: validatedData.phone,
        studentId: validatedData.studentId,
        batch: validatedData.batch,
        session: validatedData.session,
        status: "PENDING",
      },
    });

    try {
      const admins = await prisma.user.findMany({
        where: { role: "ADMIN" },
        select: { email: true },
      });
      const adminEmails = admins.map(a => a.email).filter(Boolean);

      if (adminEmails.length > 0) {
        await sendAdminNotification(adminEmails, validatedData.name, validatedData.email);
      }
    } catch (error) {
      console.error("Failed to send admin notification", error);
    }

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: "Validation failed." };
    }
    return { error: "Something went wrong. Please try again." };
  }
}
