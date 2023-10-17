export interface Election {
    id: string;
    name: string;
    description: string | null;
    date: Date;
    positions: Position[];
    managers: User[]; // replace 'users' with 'managers'
    campus: string;
  }

export interface Position {
  id: string;
  name: string;
  election: Election;
  electionId: string;
  candidates: Candidate[];
}

export interface Candidate {
  id: string;
  name: string;
  position: Position;
  positionId: string;
  votes: Vote[];
}

export interface Vote {
  id: string;
  candidate: Candidate;
  candidateId: string;
  voter: User;
  voterId: string;
}

export interface User {
    id: string;
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    image: string | null;
    managedElections: Election[]; // add this line
    votedElections: Election[];
    votes: Vote[];
    status: string | null;
    role: Role;
  }

export enum Role {
  ADMIN,
  VOTER,
  MANAGER
}
