import prisma from "../prisma";

export default async function getVoter(voterId: string) {
  return await prisma.user.findUnique({
    where: {
      id: voterId,
    },
    include: {
      votes: true,
    },
  });
}