import Chat from "./components/Chat";

interface LayoutProps {
    children: React.ReactNode
}

export default function AdminLayout({ params, children }: { params: { id: string }, children: React.ReactNode }) {
    
    return (
        <div>
             { children }
             <Chat electionId={params.id} />
        </div>
    )
}