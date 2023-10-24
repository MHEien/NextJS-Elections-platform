"use client"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useSelectedElection } from "@/lib/context/ElectionContext"
import { usePathname } from 'next/navigation'

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {

  const pathname = usePathname()
  const { selectedElection } = useSelectedElection()

  const getLinkClass = (href: string) => {
    if (pathname === href) {
      return "text-sm font-medium transition-colors hover:text-primary"
    }
    return "text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
  }

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
            {selectedElection && (
              <>
      <Link
      //Should lead to /admin/id, in case we are currently on i.e /admin/id/voters
        href={`/admin/${(selectedElection as any).value}`}
        className={getLinkClass(`/admin/${(selectedElection as any).value}`)}
      >
        Overview
      </Link>
      <Link
        href={`/admin/${(selectedElection as any).value}/sessions`}
        className={getLinkClass(`/admin/${(selectedElection as any).value}/sessions`)}
      >
        Sessions
      </Link>
        </>
      )}
      <Link
        href={`/admin/${selectedElection ? (selectedElection as any).value : ""}/voters`}
        className={getLinkClass(`/admin/${selectedElection ? (selectedElection as any).value : ""}/voters`)}
      >
        Voters
      </Link>
      <Link
        href={`/admin/${selectedElection ? (selectedElection as any).value : ""}/candidates`}
        className={getLinkClass(`/admin/${selectedElection ? (selectedElection as any).value : ""}/candidates`)}
      >
        Users & Access
      </Link>
    </nav>
  )
}