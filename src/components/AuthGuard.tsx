"use client";
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';
import Header from './Header';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  redirectIfAuthenticated?: string;
}

export default function AuthGuard({ 
  children, 
  requireAuth = false, 
  redirectTo = '/login',
  redirectIfAuthenticated = '/'
}: AuthGuardProps) {
  const { isInitialized, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized) {
      if (requireAuth && !isAuthenticated) {
        // Si requiere autenticación pero no está autenticado, redirigir
        router.push(redirectTo);
      } else if (!requireAuth && isAuthenticated) {
        // Si no requiere autenticación pero está autenticado, redirigir
        router.push(redirectIfAuthenticated);
      }
    }
  }, [isInitialized, isAuthenticated, requireAuth, router, redirectTo, redirectIfAuthenticated]);

  // Mostrar loading mientras se inicializa
  if (!isInitialized || loading) {
    return <>
      <Header />
      <LoadingSpinner hexColor='00AEEF' className='fill-fuchsia-700' />
    </>;
  }

  // Si requiere autenticación y no está autenticado, no mostrar nada (se redirigirá)
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // Si no requiere autenticación y está autenticado, no mostrar nada (se redirigirá)
  if (!requireAuth && isAuthenticated) {
    return null;
  }

  return <>{children}</>;
} 