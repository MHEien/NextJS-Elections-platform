import prisma from "../prisma";

export default async function getVoters(electionId: string) {

  const electionsVotedIn = await prisma.user.findMany({
    where: {
      votedElections: {
        some: {
          electionId: electionId
        }
      }
    },
    select: {
      id: true,
      onlineStatus: true,
      email: true,
      name: true,
      votedElections: {
        select: {
          voterId: true,
          election: {
            select: {
              id: true,
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
