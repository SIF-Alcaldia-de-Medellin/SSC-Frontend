"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

export interface Usuario {
    cedula: string;
    email: string;
    rol: string;
    nombre: string;
    createdAt?: string;
    updatedAt?: string;
}

interface AuthContextType {
    user: Usuario | null;
    isAuthenticated: boolean;
    login: (user: Usuario, token?: string) => void;
    logout: () => void;
    hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Cargar datos de autenticación desde localStorage
    const initializeAuth = () => {
      try {
        const userData = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (userData && token) {
          setUser(JSON.parse(userData));
        }
      } catch {
        // Si hay error al parsear, limpiar datos corruptos
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  const login = (user: Usuario, token?: string) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    if (token) {
      localStorage.setItem('token', token);
    }
  };

  const logout = () => {
    router.push('/login');
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const hasRole = (role: string) => {
    return user?.rol === role;
  };

  // No renderizar hasta que se haya inicializado
  if (!isInitialized) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}; 