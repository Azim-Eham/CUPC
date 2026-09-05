import { Suspense } from "react";
import LoginForm from "./login-form";
import { PublicNavbar } from "@/components/public-navbar";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | CUPC",
  description: "Log in to your Chittagong University Physics Club account to access the community feed, resources, and mentorship dashboard.",
};

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-dvh">
      <PublicNavbar hideLinks={true} />
      <Suspense fallback={<div className="flex min-h-[calc(100dvh-100px)] w-full items-center justify-center">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
