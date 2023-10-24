import { DataTable } from "./components/VoterTable";
import { getAllVotersWithElections } from "./get-voters";


export default async function VoterPage() {

    const voters = await getAllVotersWithElections();

    return (
        <DataTable voters={voters} />
    )
}