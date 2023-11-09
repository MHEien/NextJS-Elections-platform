import prisma from "@/lib/prisma";
import { Election } from "@prisma/client";

export async function getAllUsersWithElections() {
  const users = await prisma.user.findMany({
    where: {
      role: {
        in: ['MANAGER', 'ADMIN'],
      },
      hostedElections: {
        some: {},
      },
    },
    include: {
      hostedElections: true,
    },
  });
  console.log('Users:', users[0].hostedElections)
  return users;
}