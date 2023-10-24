"use client"
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "@/components/theme-provider"
import { SelectedElectionProvider } from "@/lib/context/ElectionContext"
import { Toaster } from '@/components/ui'
interface ProvidersProps {
    children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
    return (
        <SessionProvider>
            <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem={true}
            disableTransitionOnChange
            >
                <SelectedElectionProvider>
                    {children}
                    <Toaster />
                </SelectedElectionProvider>
            </ThemeProvider>
        </SessionProvider>
    )
}