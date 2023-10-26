import { DataTable } from "./components/VoterTable";
import { getAllVotersWithElections } from "./get-voters";


export default async function VoterPage() {

    const voters = await getAllVotersWithElections();
    console.log(voters)

    return (
        <DataTable voters={voters} />
    )
}