"use client";

import { Badge } from '@/components/ui/badge';
import { Table, TableHeader } from '@/components/ui/table';
import { TableBody } from '@/components/ui/table';
import { TableCaption } from '@/components/ui/table';
import { TableCell } from '@/components/ui/table';
import { TableHead } from '@/components/ui/table';
import { TableRow } from '@/components/ui/table';
import { useSocket } from '@/lib/context/SocketProvider';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { useToast } from '@/components/ui';

type StatusText = 'voted' | 'pending' | 'not voted';

type Voter = {
    id: string;
    voterId: string;
    email: string;
    name: string;
    onlineStatus: boolean;
    status: StatusText;
};

function VoterTableRow({ voter }: { voter: Voter }) {
    return (
        <TableRow className="border-b border-gray-300 dark:border-gray-700">
            <TableCell>{voter.voterId}</TableCell>
            <TableCell>{voter.name}</TableCell>
            <TableCell>
                <Badge 
                    variant="outline" 
                    className={voter.onlineStatus ? "bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-200" : "bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-200"}
                >
                </Badge>
            </TableCell>
            <TableCell>
                <Badge
                    variant="outline"
                    className={voter.status === 'voted' ? "bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-200" : "bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-200"}
                >
                    {voter.status}
                </Badge>
            </TableCell>
        </TableRow>
    );
}
 

export default function VoterTable({ electionId }: { electionId: string }) {

    const socket = useSocket();
    const { toast } = useToast();

    const fetcher = (url: string) => fetch(url).then(res => res.json());

    const { data: users, error } = useSWR('/api/admin/' + electionId + '/voters', fetcher);
    const [voters, setVoters] = useState<Voter[]>([]);

    useEffect(() => {
        console.log('Users:', users);
        if (users) {
            setVoters(users.map((user: any) => {
                return {
                    voterId: user.votedElections[0].voterId, 
                    id: user.id,
                    name: user.name,
                    onlineStatus: user.onlineStatus,
                    status: user.status || 'not voted',
                };
            }));
        }
    }
    , [users]);

    useEffect(() => {
        if (error) {
            console.log('Error:', error);
            toast({
                title: "Error",
                description: "Failed to fetch voters.",
                variant: "destructive"
            });
        }
    }
    , [error, toast]);
    

    useEffect(() => {
        if (!socket) return;

        const handleStatusUpdate = (updatedVoter: { id: string; onlineStatus: boolean }) => {
            setVoters(prevVoters => prevVoters.map(voter => 
                voter.id === updatedVoter.id 
                    ? { ...voter, onlineStatus: updatedVoter.onlineStatus } 
                    : voter
            ));
        };
        

        socket.on("status-update", handleStatusUpdate);

        return () => {
            socket.off("status-update", handleStatusUpdate);
        };
    }, [socket]);

  return (
    <>
      <Table>
        <TableCaption className="text-lg font-semibold mb-4">Voter Status</TableCaption>
        <TableHeader>
            <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Online Status</TableHead>
                <TableHead>Status</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {voters.map((voter) => (
                <VoterTableRow key={voter.id} voter={voter} />
            ))}
        </TableBody>
      </Table>
    </>
  );
};
