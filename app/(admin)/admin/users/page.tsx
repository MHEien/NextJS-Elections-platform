import { DataTable } from "./components/UserTable";
import { getAllUsersWithElections } from "./get-users";


export default async function UsersPage() {

    const users = await getAllUsersWithElections();

    return (
        <DataTable users={users} />
    )
}