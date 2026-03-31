"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface QuickLogContextValue {
  isOpen: boolean;
  preselectedPersonId: string | null;
  openQuickLog: (personId?: string) => void;
  closeQuickLog: () => void;
}

const QuickLogContext = createContext<QuickLogContextValue>({
  isOpen: false,
  preselectedPersonId: null,
  openQuickLog: () => {},
  closeQuickLog: () => {},
});

export function QuickLogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [preselectedPersonId, setPreselectedPersonId] = useState<string | null>(null);

  const openQuickLog = useCallback((personId?: string) => {
    setPreselectedPersonId(personId || null);
    setIsOpen(true);
  }, []);

  const closeQuickLog = useCallback(() => {
    setIsOpen(false);
    setPreselectedPersonId(null);
  }, []);

  return (
    <QuickLogContext.Provider value={{ isOpen, preselectedPersonId, openQuickLog, closeQuickLog }}>
      {children}
    </QuickLogContext.Provider>
  );
}

export function useQuickLog() {
  return useContext(QuickLogContext);
}
