"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Notification {
    message: string;
    type: 'success' | 'error';
}

interface NotifierContextType {
    notification: Notification | null;
    setNotification: (notification: Notification | null) => void;
}


const NotifierContext = createContext<NotifierContextType | undefined>(undefined);

export const NotifierProvider = ({ children }: { children: ReactNode }) => {
  const [notification, setNotification] = useState<Notification | null>(null);

  return (
    <NotifierContext.Provider value={{ notification, setNotification }}>
      {children}
    </NotifierContext.Provider>
  );
};

export const useNotifier = () => {
  const context = useContext(NotifierContext);
  if (!context) {
    throw new Error('useNotifier debe usarse dentro de un NotifierProvider');
  }
  return context;
}; 