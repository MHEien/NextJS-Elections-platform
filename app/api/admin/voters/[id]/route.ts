import { NextResponse, NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import getVoter from '@/lib/api/getVoter';
import { useRouter } from 'next/router';

export async function GET(request: NextRequest, context: { params }) {

    const id = context.params.id;
    
    const voter = await getVoter(id);
    return NextResponse.json(voter);
}