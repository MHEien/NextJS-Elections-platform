import prisma from "../prisma";

export default async function getVoter(id: string) {

  const electionsVotedIn = await prisma.user.findUnique({
    where: {
      id: id
    },
    select: {
      votedElections: {
        select: {
          election: {
            select: {
              name: true,
              date: true,
              campus: true,
            }
          }
        }
      }
    }
  });

  return electionsVotedIn;
}
