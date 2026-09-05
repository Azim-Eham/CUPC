import type { Metadata } from "next";
import RegisterForm from "./register-form";
import { PublicNavbar } from "@/components/public-navbar";

export const metadata: Metadata = {
  title: "Register | CUPC",
  description: "Create an account to join the Chittagong University Physics Club community.",
};

export default function RegisterPage() {
  return (
    <div className="flex flex-col min-h-dvh">
      <PublicNavbar />
      <RegisterForm />
    </div>
  );
}
