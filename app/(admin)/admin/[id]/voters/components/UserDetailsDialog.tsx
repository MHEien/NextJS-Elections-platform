"use client"
import { Avatar, Card } from "@/components/ui";
import { AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import axios from "axios";
import { useEffect, useState } from "react";
import { Election, User } from "@prisma/client";
import { VotersWithElections } from "@/lib/types/Election";
import { getInitials } from "@/lib/utils";

export function UserDetailsDialog({ user }: { user: VotersWithElections }) {
    

    const renderTableItem = (item: Election) => {
        return (
            <TableRow>
                <TableCell className="text-gray-700 dark:text-gray-200">{item.name}</TableCell>
                <TableCell className="text-gray-700 dark:text-gray-200">{item.date?.toDateString()}</TableCell>
            </TableRow>
        )
    }

    if (!user) {
        return null;
    }

    return (
        <>
                    <DialogContent className="dark:bg-black bg-white rounded-lg p-6 max-w-screen-md">
                <DialogHeader>
                    <Avatar className="w-20 h-20 flex items-center justify-center mr-6">
                        <AvatarImage src="https://github.com/username.png" alt="@username" />
                        <AvatarFallback>{getInitials(user.name || '')}</AvatarFallback>
                    </Avatar>
                    <div>
                        <DialogTitle className="text-xl font-bold dark:text-white">{user.name}</DialogTitle>
                        <DialogDescription className="text-gray-500 dark:text-gray-300">{user.role}</DialogDescription>
                    </div>
                </DialogHeader>
                <Card className="mt-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold dark:text-white">About</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="text-gray-500 dark:text-gray-300">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</CardDescription>
                    </CardContent>
                </Card>
                <Table className="mt-6 w-full">
                    <TableCaption className="text-xl font-bold dark:text-white">Elections participated</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-gray-500 dark:text-gray-300">Election Name</TableHead>
                            <TableHead className="text-gray-500 dark:text-gray-300">Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {user.votedElections.map(renderTableItem)} 
                    </TableBody>
                </Table>
            </DialogContent>
        </>
    )
}
