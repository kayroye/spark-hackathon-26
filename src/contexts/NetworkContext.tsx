'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface NetworkContextType {
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  toggleNetwork: () => void;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);

  const toggleNetwork = () => setIsOnline((prev) => !prev);

  return (
    <NetworkContext.Provider value={{ isOnline, setIsOnline, toggleNetwork }}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within NetworkProvider');
  }
  return context;
}
