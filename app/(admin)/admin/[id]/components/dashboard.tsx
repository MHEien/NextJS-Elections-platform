"use client";
import { Card } from '@/components/ui/card';
import { CardContent } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import { TableBody } from '@/components/ui/table';
import { TableCaption } from '@/components/ui/table';
import { TableCell } from '@/components/ui/table';
import { TableHead } from '@/components/ui/table';
import { TableHeader } from '@/components/ui/table';
import { TableRow } from '@/components/ui/table';
import { AreaChart } from 'lucide-react';
import { Election } from '@prisma/client';


export default function Dashboard({ election }: { election: Election }) {

  return (
    <div className="px-4 py-6 dark:bg-black">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4 bg-white rounded-lg shadow dark:bg-gray-800">
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="text-primary-500 rounded-lg text-center dark:text-white">
                <AreaChart size={24} />
              </div>
              <div className="text-right">
                <p className="text-2xl">1,257</p>
                <p>Votes</p>
              </div>
            </div>

            <div className="progress">
              <div className="progress-bar bg-primary-500" style={{ width: "55%" }}></div>
            </div>
          </CardContent>
        </Card>

        {/* repeat the cards as much as you need */}

      </div>

      <Table className="mt-8">
        <TableCaption>Election Stats</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Candidate</TableHead>
            <TableHead>Votes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Candidate 1</TableCell>
            <TableCell className="font-medium">600</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Candidate 2</TableCell>
            <TableCell className="font-medium">657</TableCell>
          </TableRow>
          {/* repeat the rows as much as you need */}
        </TableBody>
      </Table>
    </div>
  )
}