import Navigation from "./components/nav";

interface LayoutProps {
    children: React.ReactNode
}

export default function AdminLayout({ children }: LayoutProps) {
    
    return (
        <div>
            <Navigation />
             { children }
        </div>
    )
}