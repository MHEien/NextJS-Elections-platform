import { createContext, useContext, useState } from 'react';
import { Election } from '../types/Election';

const SelectedElectionContext = createContext({
  selectedElection: null as Election | null,
  setSelectedElection: (_: Election | null) => { },
});

export function useSelectedElection() {
  return useContext(SelectedElectionContext);
}

export interface SelectedElectionProviderProps {
  children: React.ReactNode;
}

export function SelectedElectionProvider({ children }: SelectedElectionProviderProps) {
  const [selectedElection, setSelectedElection] = useState<Election | null>(null);

  return (
    <SelectedElectionContext.Provider value={{ selectedElection, setSelectedElection }}>
      {children}
    </SelectedElectionContext.Provider>
  );
}