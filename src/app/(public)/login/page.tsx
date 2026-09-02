import { Suspense } from "react";
import LoginForm from "./login-form";
import { PublicNavbar } from "@/components/public-navbar";

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicNavbar hideLinks={true} />
      <Suspense fallback={<div className="flex min-h-[calc(100vh-100px)] w-full items-center justify-center">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
