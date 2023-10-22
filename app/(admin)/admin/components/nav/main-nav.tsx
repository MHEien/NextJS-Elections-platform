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
  const { selectedElection, setSelectedElection } = useSelectedElection()
  const handleOverviewClick = () => {
    setSelectedElection(null);
  };


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
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Overview
      </Link>
      <Link
        href={`/admin/${(selectedElection as any).value}/sessions`}
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Sessions
      </Link>
        </>
      )}
      <Link
        href={`/admin/${selectedElection ? (selectedElection as any).value : ""}/voters`}
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Voters
      </Link>
      <Link
        href={`/admin/${selectedElection ? (selectedElection as any).value : ""}/candidates`}
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Users & Access
      </Link>
    </nav>
  )
}