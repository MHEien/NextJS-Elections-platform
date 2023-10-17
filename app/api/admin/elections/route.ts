import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// In your route.ts file
async function fetchAllElections() {
    // Fetch all elections from the database, including the manager's ID
    return await prisma.election.findMany({
      include: {
        managers: true,
      },
    });
  }

async function fetchElectionsByManager(id: string) {
  // Fetch elections owned by the manager from the database
  return await prisma.election.findMany({
    where: {
        managers: {
            some: {
            id: id,
            },
        },
    },
    include: {
        managers: true,
    },
  });
}

async function getElections(userRole: string, id: string) {
    console.log(`User role: ${userRole}, id: ${id}`);
    let userElections: { [key: string]: any }[] = [];
    if (userRole === 'MANAGER') {
      userElections = await fetchElectionsByManager(id);
    }

    const allElections = await fetchAllElections();
  
    const response = {
        userElections: userElections.map(election => ({
            label: election.name,
            value: election.id,
            managers: election.managers,
        })),
        allElections: allElections.map(election => ({
            label: election.name,
            value: election.id,
            managers: election.managers,
        }))
    };
  
    return response;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session?.user?.email;
    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "MANAGER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const electionsData = await getElections(session.user.role, session.user.id);
    console.log("Elections data retrieved: ", electionsData);
    return NextResponse.json(electionsData);
    } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
    try {
        console.log("POST request received");
        const session = await getServerSession(authOptions);
        console.log("Session retrieved: ", session);
    
        if (!session) {
            console.log("No session found");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    
        const userEmail = session?.user?.email;
        console.log("User email retrieved: ", userEmail);
        if (!userEmail) {
            console.log("No user email found");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    
        if (session.user.role !== "ADMIN" && session.user.role !== "MANAGER") {
            console.log("User role is not ADMIN or MANAGER");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    
        const { name, description, date, campus } = await req.json();
        console.log("Request JSON parsed: ", { name, description, date, campus });
    
        const election = await prisma.election.create({
            data: {
                name: name,
                description: description,
                date: date,
                campus: campus,
                managers: {
                    connect: {
                        email: userEmail,
                    },
                },
            },
        });
        console.log("Election created: ", election);
    
        return NextResponse.json(election);
    } catch (error) {
        console.log("Error occurred: ", error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}