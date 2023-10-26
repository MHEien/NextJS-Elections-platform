import { NextResponse, NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { User } from '@prisma/client';
import axios from 'axios';

export async function POST(req: NextRequest) {
    try {
        const { voters, electionId } = await req.json();
        console.log("POST request received");
        console.log(voters);
        console.log(electionId);

        const voterPromises = voters.map(async (voter: any) => { // Changed User to any for flexibility

            const { user, voterId, weight } = voter;
            const { email, name } = user;
            
            try {
            if (email === null) {
                throw new Error("Email is missing");
            }
            console.log(`Finding voter with email ${email}`)
            const existingUser = await prisma.user.findUnique({
                where: {
                    email: email
                }
            });

            if (existingUser) {
                console.log(`Found existing user with email ${email}`)
                console.log('Updating user...');
                const updatedUser = await prisma.user.update({
                    where: {
                        email: email
                    },
                    data: {
                        name: name,
                        votedElections: { // Corrected the name here
                            upsert: {
                                create: {
                                    electionId: electionId,
                                    weight: weight || 1,
                                    voterId: voterId
                                },
                                update: {
                                    weight: weight || 1,
                                },
                                where: {
                                    userId_electionId: { userId: existingUser.id, electionId: electionId }
                                }
                            }
                        }
                    }
                });
                console.log(`Updated user with email ${email}`)
                console.log(updatedUser)
                return updatedUser;
            } else {
                console.log(`Creating new user with email ${email}`)
                const createdUser = await prisma.user.create({
                    data: {
                        email: email,
                        name: name,
                        status: "PENDING",
                        role: "VOTER",
                        votedElections: { // Corrected the name here
                            create: {
                                electionId: electionId,
                                weight: weight || 1,
                                voterId: voterId
                            }
                        }
                    }
                });
                console.log(`Created new user with email ${email}`)
                console.log(createdUser)
                return createdUser;
            }
        } catch (err) {
            console.error(`Error processing voter with email ${email}:`, err);
            return err;
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
