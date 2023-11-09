import prisma from "@/lib/prisma";

export async function deleteVoters(userIds: string[], electionId: string) {
  const deleteVotersTransaction = userIds.map((id) =>
    prisma.userElectionVote.deleteMany({
      where: {
        userId: id,
        electionId: electionId,
      },
    })
  );

  try {
    await prisma.$transaction(deleteVotersTransaction);
    console.log('Voters deleted successfully');
  } catch (error) {
    console.error('An error occurred while deleting voters:', error);
  }
}