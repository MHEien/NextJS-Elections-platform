import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface Context {
    params: {
      electionId: string;
    };
  }

  export async function GET(request: NextRequest, context: { params : { electionId: string } }): Promise<NextResponse> {
    const id = context.params.electionId;
  
    try {
      const chat = await prisma.chat.findUnique({
        where: {
            id: id
            },
        include: {
          messages: {
            orderBy: {
              sentAt: 'desc'
            },
            select: {
              content: true,
              sentAt: true,
              sender: {
                select: {
                  name: true,
                  image: true
                }
              }
            }
          }
        }
      });
  
      if (!chat) {
        return NextResponse.json({ error: "Chat not found" }, { status: 404 });
      }
  
      return NextResponse.json(chat);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
  }