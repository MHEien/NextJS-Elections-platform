import prisma from "@/lib/prisma";
import { Election } from "@prisma/client";

export async function getElection(id: string): Promise<Election> {
    const election = await prisma.election.findUnique({
        where: {
        id: id,
        },
        include: {
        managers: true,
        positions: {
            include: {
            candidates: {
                include: {
                votes: true,
                },
            },
            },
        },
        voters: {
            include: {
            votes: true,
            },
        },
        },
    });

    if (!election) {
        throw new Error("Election not found");
    }
    
    return election;
    }

