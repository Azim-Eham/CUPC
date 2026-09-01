"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { registerSchema } from "@/lib/validations/auth";
import { registerUser } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "STUDENT",
      department: "Physics",
      phone: "",
      studentId: "",
      batch: "",
      session: "",
    },
  });

  const selectedRole = form.watch("role");

  async function onSubmit(data: z.infer<typeof registerSchema>) {
    setIsLoading(true);

    try {
      const result = await registerUser(data);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      setIsSuccess(true);
      toast.success("Registration successful! Please wait for admin approval.");
    } catch (error) {
      toast.error("An error occurred during registration.");
    } finally {
      setIsLoading(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="flex min-h-[calc(100vh-100px)] w-full items-center justify-center px-4 bg-slate-900">
        <Card className="w-full max-w-md text-center bg-slate-950 border-white/10 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-slate-50">Registration Submitted</CardTitle>
            <CardDescription className="text-slate-400">
              Your account has been created and is pending approval from an administrator.
              You will receive an email once your account is activated.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center border-t border-white/5 pt-6 mt-2">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Link href="/login">Return to Login</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-min-h-[calc(100vh-100px)] w-full items-center justify-center px-4 py-8 bg-slate-900">
      <Card className="w-full max-w-md bg-slate-950 border-white/10 shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img src="/CUPC_logo.jpg" alt="CUPC Logo" className="w-16 h-16 rounded-full" />
           </div>
          <CardTitle className="text-2xl font-bold text-slate-50">Join CUPC</CardTitle>
          <CardDescription className="text-slate-400">Create an account to connect with the community</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-200">Full Name</Label>
                <Input id="name" className="bg-slate-900 border-white/10 text-white focus-visible:ring-green-500" {...form.register("name")} />
                {form.formState.errors.name && (
                  <p className="text-xs text-red-400">{form.formState.errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="role" className="text-slate-200">Role</Label>
                <select
                  id="role"
                  className="flex h-9 w-full rounded-md border border-white/10 bg-slate-900 px-3 py-1 text-sm shadow-sm transition-colors text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-500 disabled:cursor-not-allowed disabled:opacity-50"
                  {...form.register("role")}
                >
                  <option value="STUDENT">Student</option>
                  <option value="ALUMNI">Alumni</option>
                  <option value="FACULTY">Faculty</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">Email</Label>
              <Input id="email" type="email" placeholder="name@example.com" className="bg-slate-900 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-green-500" {...form.register("email")} />
              {form.formState.errors.email && (
                <p className="text-xs text-red-400">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-200">Password</Label>
              <Input id="password" type="password" className="bg-slate-900 border-white/10 text-white focus-visible:ring-green-500" {...form.register("password")} />
              {form.formState.errors.password && (
                <p className="text-xs text-red-400">{form.formState.errors.password.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department" className="text-slate-200">Department</Label>
                <Input id="department" className="bg-slate-900 border-white/10 text-white focus-visible:ring-green-500" {...form.register("department")} defaultValue="Physics" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-200">Phone (Optional)</Label>
                <Input id="phone" className="bg-slate-900 border-white/10 text-white focus-visible:ring-green-500" {...form.register("phone")} />
              </div>
            </div>

            {selectedRole === "STUDENT" && (
              <div className="grid grid-cols-3 gap-4 rounded-md border border-white/10 p-4 bg-slate-900/50">
                <div className="space-y-2">
                  <Label htmlFor="studentId" className="text-slate-200">Student ID</Label>
                  <Input id="studentId" className="bg-slate-900 border-white/10 text-white focus-visible:ring-green-500" {...form.register("studentId")} />
                  {form.formState.errors.studentId && (
                    <p className="text-xs text-red-400">{form.formState.errors.studentId.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="batch" className="text-slate-200">Batch</Label>
                  <Input id="batch" placeholder="e.g. 52nd" className="bg-slate-900 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-green-500" {...form.register("batch")} />
                  {form.formState.errors.batch && (
                    <p className="text-xs text-red-400">{form.formState.errors.batch.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="session" className="text-slate-200">Session</Label>
                  <Input id="session" placeholder="2020-21" className="bg-slate-900 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-green-500" {...form.register("session")} />
                  {form.formState.errors.session && (
                    <p className="text-xs text-red-400">{form.formState.errors.session.message}</p>
                  )}
                </div>
              </div>
            )}

            <Button className="w-full mt-6 bg-amber-600 hover:bg-amber-700 text-white" type="submit" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Register"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 text-center text-sm border-t border-white/5 pt-6 mt-2">
          <div className="text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-amber-500 hover:text-amber-400 hover:underline">
              Log in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
