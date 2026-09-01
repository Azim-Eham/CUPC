import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  role: z.enum(["STUDENT", "ALUMNI", "FACULTY"]),
  department: z.string().min(2, "Department is required."),
  phone: z.string().optional(),

  // Conditionally required based on role
  studentId: z.string().optional(),
  batch: z.string().optional(),
  session: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.role === "STUDENT") {
    if (!data.studentId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Student ID is required for students.",
        path: ["studentId"],
      });
    }
    if (!data.batch) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Batch is required for students.",
        path: ["batch"],
      });
    }
    if (!data.session) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Session is required for students.",
        path: ["session"],
      });
    }
  }
});
