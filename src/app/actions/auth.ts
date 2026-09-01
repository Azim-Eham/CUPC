"use server";

import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";
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

    // TODO: Trigger email notification to admin here if desired

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: "Validation failed." };
    }
    return { error: "Something went wrong. Please try again." };
  }
}
