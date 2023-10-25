"use client"
import { Table } from '@/components/ui/table';
import { TableBody } from '@/components/ui/table';
import { TableCaption } from '@/components/ui/table';
import { TableCell } from '@/components/ui/table';
import { TableHead } from '@/components/ui/table';
import { TableHeader } from '@/components/ui/table';
import { TableRow } from '@/components/ui/table';
import { Election } from '@prisma/client';
import { useEffect, useState } from 'react';

export function ElectionTable() {

    const [elections, setElections] = useState<Election[]>([]);

        useEffect(() => {
            fetch('/api/admin/elections')
                .then(response => response.json())
                .then(data => {
    console.log('Response:', data)
    const myElections = Array.isArray(data.myElections) ? data.myElections : [];
    const allElections = Array.isArray(data.allElections) ? data.allElections : [];
    setElections([...myElections, ...allElections]);
    }
    )
    }
    , []);
    

    console.log('Fetched elections:', elections);
    
    if (!elections.length) {
       return null;
    }

    return (
        <>
        <Table className="mt-8">
        <TableCaption>Election Stats</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Election</TableHead>
            <TableHead>Sessions</TableHead>
            <TableHead>Voters</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
            {elections.map((election) => (
                <TableRow key={election.id}>
                    <TableCell>{election.name}</TableCell>
                    <TableCell>{election.positions.length}</TableCell>
                    <TableCell>{election.voters.length}</TableCell>
                    <TableCell>
                        <button className="btn btn-primary">View</button>
                        <button className="btn btn-primary">Edit</button>
                        <button className="btn btn-primary">Delete</button>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
        </Table>
        </>
    )
}
