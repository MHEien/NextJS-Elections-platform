import Dashboard from "./components/dashboard";
import { getElection } from "./getElection";

export default async function DashboardPage({ params }: { params: { id: string } }) {

    const election = await getElection(params.id);

    return (
        <Dashboard election={election} />
    )
}