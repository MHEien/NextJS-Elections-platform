"use client"
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useToast } from "@/components/ui";

export function AdminLogin() {

  const login = async () => {
    signIn('azure-ad', { callbackUrl: `${window.location.origin}/admin` });
  }

      return <Link onClick={() => login()} href="#">
        Admin & Manager login
      </Link>
}