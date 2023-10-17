"use client"
import { Avatar, Card } from "@/components/ui";
import { AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import axios from "axios";
import { useEffect, useState } from "react";
import { User } from "@prisma/client";

export function UserDetailsDialog({ userId }: { userId: string }) {
    
    const [user, setUser] = useState<User>({} as User)

    useEffect(() => {
        const fetchUser = async () => {
            const { data } = await axios.get(`/api/admin/voters/${userId}`)
            setUser(data)
            console.log(data)
        }
        fetchUser()
    }, [userId])

    return (
        <>
                    <DialogContent className="dark:bg-black bg-white rounded-lg p-6 max-w-screen-md">
                <DialogHeader>
                    <Avatar className="w-20 h-20 flex items-center justify-center mr-6">
                        <AvatarImage src="https://github.com/username.png" alt="@username" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                        <DialogTitle className="text-xl font-bold dark:text-white">John Doe</DialogTitle>
                        <DialogDescription className="text-gray-500 dark:text-gray-300">New York, USA</DialogDescription>
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
                    <TableCaption className="text-xl font-bold dark:text-white">Sessions participated</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-gray-500 dark:text-gray-300">Session Name</TableHead>
                            <TableHead className="text-gray-500 dark:text-gray-300">Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="text-gray-700 dark:text-gray-200">Session 1</TableCell>
                            <TableCell className="text-gray-700 dark:text-gray-200">01/01/2021</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="text-gray-700 dark:text-gray-200">Session 2</TableCell>
                            <TableCell className="text-gray-700 dark:text-gray-200">02/02/2021</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="text-gray-700 dark:text-gray-200">Session 3</TableCell>
                            <TableCell className="text-gray-700 dark:text-gray-200">03/03/2021</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </DialogContent>
            </>
    )
}