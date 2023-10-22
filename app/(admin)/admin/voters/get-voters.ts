import prisma from "@/lib/prisma";
import { Election } from "@prisma/client";

export async function getAllVotersWithElections() {
    const voters = await prisma.user.findMany({
      where: {
        votedElections: {
          some: {},
        },
      },
      include: {
        votedElections: true,
      },
    });
    return voters;
  }