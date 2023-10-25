"use client"
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useToast } from "@/components/ui";

export function AdminLogin() {

      return <Link onClick={() => signIn('azure-ad')} href="#">
        Admin & Manager login
      </Link>
}