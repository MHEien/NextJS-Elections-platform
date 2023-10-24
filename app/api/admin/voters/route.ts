import { NextResponse, NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { User } from '@prisma/client';

export async function POST(req: NextRequest) {
    try {
        const { voters } = await req.json();

        console.log("POST request received");

        const voterPromises = voters.map(async (voter: User) => {

            if (voter.email === null) {
                throw new Error("Email is missing");
            }

            const user = await prisma.user.findUnique({
                where: {
                    email: voter.email
                }
            });

            if (user) {
                return prisma.user.update({
                    where: {
                        email: voter.email
                    },
                    data: {
                        name: voter.name,
                    }
                });
            } else {
                return prisma.user.create({
                    data: {
                        email: voter.email,
                        name: voter.name,
                        status: "PENDING",
                        role: "VOTER"
                    }
                });
            }
        });

        const results = await Promise.allSettled(voterPromises);

        const successfulInvites = results
        .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
        .map(result => result.value);
    
    const failedInvites = results
        .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
        .map(result => result.reason);

        return NextResponse.json({ successfulInvites, failedInvites });
    }
    catch (err) {
        console.log(err);
        return NextResponse.json({ error: err });
    }
}