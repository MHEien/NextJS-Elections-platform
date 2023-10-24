import { createContext, useContext, useEffect, useState } from 'react';
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

  // Load the selectedElection from local storage when the component mounts
  useEffect(() => {
    const storedElection = localStorage.getItem('selectedElection');
    if (storedElection) {
      setSelectedElection(JSON.parse(storedElection));
    }
  }, []);

  // Save the selectedElection to local storage whenever it changes
  useEffect(() => {
    if (selectedElection) {
      localStorage.setItem('selectedElection', JSON.stringify(selectedElection));
    } else {
      localStorage.removeItem('selectedElection');
    }
  }, [selectedElection]);

  return (
    <SelectedElectionContext.Provider value={{ selectedElection, setSelectedElection }}>
      {children}
    </SelectedElectionContext.Provider>
  );
}