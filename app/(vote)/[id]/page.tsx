import { Alert } from '@/components/ui/alert';
import { AlertDescription } from '@/components/ui/alert';
import { AlertTitle } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';
import { Smile } from 'lucide-react';
import React from 'react';
import VotingCard from './_components/VoteCard';
import prisma from '@/lib/prisma';



export default function VotePage({ params }: { params: { id: string } }) {

const electionId = params.id;
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-black space-y-12">
      <div className="flex flex-col items-center space-y-8 h-screen">
        <VotingCard electionId={electionId} />
      </div>
      <div className="flex justify-center space-x-2">
        <CheckCircle className="h-5 w-5 text-green-600" />
        <span className="font-medium">Your vote has been successfully cast!</span>
      </div>
    </div>
  );
};
