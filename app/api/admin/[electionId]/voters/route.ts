import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { VotersWithElections } from "@/lib/types/Election";
import getVoters from '@/lib/api/getVoters';

interface Context {
    params: {
      electionId: string;
    };
  }

export async function GET(request: NextRequest, context: { params : { electionId: string } }): Promise<NextResponse> {
    try {
        const id = context.params.electionId;
        console.log('Election ID: ', id);
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const voters = await getVoters(id);

        return NextResponse.json(voters);
    }
    catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
