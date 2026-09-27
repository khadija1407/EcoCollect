import React, { createContext, useContext, useState, useEffect } from 'react';

interface RequestContextType {
  savedRequestIds: string[];
  saveRequestId: (id: string) => void;
  removeRequestId: (id: string) => void;
  clearSavedRequests: () => void;
}

const RequestContext = createContext<RequestContextType | undefined>(undefined);

const STORAGE_KEY = 'ecocollect_saved_requests';

export const RequestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedRequestIds, setSavedRequestIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedRequestIds));
    } catch {
      // Storage unavailable
    }
  }, [savedRequestIds]);

  const saveRequestId = (id: string) => {
    setSavedRequestIds((prev) => {
      if (!prev.includes(id)) {
        return [id, ...prev];
      }
      return prev;
    });
  };

  const removeRequestId = (id: string) => {
    setSavedRequestIds((prev) => prev.filter((r) => r !== id));
  };

  const clearSavedRequests = () => {
    setSavedRequestIds([]);
  };

  return (
    <RequestContext.Provider
      value={{
        savedRequestIds,
        saveRequestId,
        removeRequestId,
        clearSavedRequests,
      }}
    >
      {children}
    </RequestContext.Provider>
  );
};

export const useRequestContext = () => {
  const context = useContext(RequestContext);
  if (!context) {
    throw new Error('useRequestContext must be used within a RequestProvider');
  }
  return context;
};
