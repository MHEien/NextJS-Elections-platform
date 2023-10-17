import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userEmail = session?.user?.email;

        if (!userEmail) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const usersWithRoles = await prisma.electionRole.findMany({
            where: {
              OR: [
                { roleName: 'ADMIN' },
                { roleName: 'MANAGER' },
              ],
            },
            select: {
              user: true,  // Selects the related user records
            },
            distinct: ['userId'],  // Ensures unique user records are returned
          });
          
          // Now usersWithRoles contains the unique users with either ADMIN or MANAGER roles in any election
        
        return NextResponse.json(usersWithRoles);
          
    } catch (error) {
        console.error(error);  // Log the error for debugging purposes
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}