"use client"
import Link from "next/link";
import { useSelectedElection } from "@/lib/context/ElectionContext";

export default function AdminLink() {

    const { setSelectedElection } = useSelectedElection();

    return <Link
    href="/admin"
    onClick={() => setSelectedElection(null)}        
    className="text-sm font-medium transition-colors hover:text-primary"
  >
    Admin
  </Link>
}