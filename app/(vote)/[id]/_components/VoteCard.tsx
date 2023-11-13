"use client"
import { Alert } from '@/components/ui/alert';
import { AlertDescription } from '@/components/ui/alert';
import { AlertTitle } from '@/components/ui/alert';
import { Avatar } from '@/components/ui/avatar';
import { AvatarFallback } from '@/components/ui/avatar';
import { AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CardContent } from '@/components/ui/card';
import { CardDescription } from '@/components/ui/card';
import { CardFooter } from '@/components/ui/card';
import { CardHeader } from '@/components/ui/card';
import { CardTitle } from '@/components/ui/card';
import { Position } from '@prisma/client';
import { CheckCircle } from 'lucide-react';
import { Smile } from 'lucide-react';
import React, { useEffect } from 'react';
import io from 'socket.io-client';
import { Socket } from 'socket.io-client';
import { useContext } from 'react';
import { SocketContext } from '@/lib/context/SocketProvider';
import { useSession } from 'next-auth/react';

interface VoteCardProps {
  position: Position;
  candidates: {
    id: string;
    name: string;
    description: string;
  }[];
}

const candidates: VoteCardProps['candidates'] = [
  {
    id: '1',
    name: 'John Doe',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod.',
  },
  {
    id: '2',
    name: 'Jane Doe',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod.',
  },
  {
    id: '3',
    name: 'John Smith',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod.',
  },
  {
    id: '4',
    name: 'Jane Smith',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod.',
  },
];

function VotingCardItem({ candidate, onVote }: { candidate: VoteCardProps['candidates'][number]; onVote: (candidateId: string) => void }) {
  return (
    <Card className="transition ease-in-out duration-200 transform hover:scale-105 w-full sm:max-w-xl lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl">
      <CardHeader>
        <CardTitle>{candidate.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center space-y-2">
          <Avatar className="w-32 h-32">
            <AvatarImage src="/defaultAvatar.png" alt={candidate.name} />
            <AvatarFallback>{candidate.name}</AvatarFallback>
          </Avatar>
          <CardDescription>{candidate.description}</CardDescription>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={() => onVote(candidate.id)}>Vote</Button>
      </CardFooter>
    </Card>
  );
}

export default function VotingCard({ electionId }: { electionId: string }) {

  const session = useSession();

  const socket = useContext(SocketContext);

  useEffect(() => {
    if (socket) {
      socket.emit('join_election', electionId);
    }
  }
  , [socket, electionId]);

  // Define the onVote function
  const onVote = (candidateId: string) => {
    if (socket) {
      socket.emit('vote', { candidateId, electionId, sessionId: session.data?.user.id });
    }
  };
    
    return (
        <>
            <div className="flex flex-col items-center justify-center space-y-8">
                <Alert className="w-full sm:max-w-2xl">
                    <Smile className="h-5 w-5" />
                    <AlertTitle>Welcome Voter!</AlertTitle>
                    <AlertDescription>
                        Voting is an important aspect of democracy. Please make your selection below.
                    </AlertDescription>
                </Alert>
                <div className="flex flex-col items-center space-y-8">
                    {candidates.map((candidate) => (
                        <VotingCardItem key={candidate.id} candidate={candidate} onVote={onVote} />
                    ))}
                </div>
            </div>
            <div className="flex justify-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium">Your vote has been successfully cast!</span>
            </div>
        </>
    );
}