import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";



export async function GET() {
    try {
        console.log("GET request received");
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
    
        if (session.user.role === "MANAGER") {
        const elections = await prisma.election.findMany({
            where: {
                managers: {
                    some: {
                        email: userEmail,
                    },
                },
            },
        });
        console.log("Elections retrieved: ", elections);
    

        return NextResponse.json({ myElections: elections, allElections: [] });
        }

        const elections = await prisma.election.findMany(
            {
                include: {
                    managers: true,
                    positions: true,
                    voters: true,
                },
            }
        );
        console.log("Elections retrieved: ", elections);

        const myElections = elections.filter((election) => {
            return election.managers.some((manager) => {
                return manager.email === userEmail;
            });
        });
        console.log("My elections retrieved: ", myElections);


        const allElections = elections.filter((election) => {
            return !election.managers.some((manager) => {
                return manager.email === userEmail;
            });
        }
        );
        console.log("All elections retrieved: ", allElections);

        return NextResponse.json({ myElections: myElections, allElections: allElections });
    }
    catch (error) {
        console.log("Error occurred: ", error);
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