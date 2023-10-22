import { NextResponse, NextRequest } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest, { params }): Promise<Response> {
    const id = params.id;
    const voterId = params.get('userId') || undefined;

        const voterElections = await prisma.user.findUnique({
        where: {
            id: voterId,
        },
        include: {
            votedElections: true,
        },
        });

    return NextResponse.json(voterElections);
}