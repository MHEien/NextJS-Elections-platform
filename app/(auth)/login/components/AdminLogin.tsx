"use client"
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { useToast } from "@/components/ui";

export function AdminLogin() {

  const login = async () => {
    signIn('azure-ad', { callbackUrl: `${window.location.origin}/admin` });
  }

      return <Button onClick={() => login()}>
        Admin & Manager login
      </Button>
}