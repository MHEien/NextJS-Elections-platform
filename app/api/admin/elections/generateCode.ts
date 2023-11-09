import prisma from "@/lib/prisma";

export async function generateUniqueCode(): Promise<string> {
    const code = Math.floor(10000 + Math.random() * 90000).toString(); // generates a random 5-digit number

    const existingElection = await prisma.election.findUnique({
        where: { code: code },
    });

    if (existingElection) {
        return generateUniqueCode(); // if code already exists, generate a new one
    } else {
        return code; // if code doesn't exist, return it
    }
}