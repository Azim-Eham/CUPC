"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { loginSchema } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof loginSchema>) {
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        toast.error(result.error === "CredentialsSignin" ? "Invalid email or password" : result.error);
        return;
      }

      const from = searchParams.get("from") || "/feed";
      router.push(from);
      router.refresh();
    } catch {
      toast.error("An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100dvh-100px)] w-full items-center justify-center px-4 bg-slate-900">
      <Card className="w-full max-w-md bg-slate-950 border-white/10 shadow-xl">
        <CardHeader className="space-y-1 text-center">
           <div className="flex justify-center mb-4">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img src="/CUPC_logo.jpg" alt="CUPC Logo" className="w-16 h-16 rounded-full" />
           </div>
          <CardTitle className="text-2xl font-bold text-slate-50">Welcome back</CardTitle>
          <CardDescription className="text-slate-400">Enter your email and password to login to CUPC</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="bg-slate-900 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-green-500"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-400">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-200">Password</Label>
              <Input
                id="password"
                type="password"
                className="bg-slate-900 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-green-500"
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-red-400">{form.formState.errors.password.message}</p>
              )}
            </div>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white" type="submit" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 text-center text-sm border-t border-white/5 pt-6 mt-2">
          <div className="text-slate-400">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-amber-500 hover:text-amber-400 hover:underline">
              Register here
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
