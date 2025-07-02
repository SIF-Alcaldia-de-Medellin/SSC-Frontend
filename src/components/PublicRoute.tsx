"use client";

import AuthGuard from './AuthGuard';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectIfAuthenticated?: string;
}

export default function PublicRoute({ children, redirectIfAuthenticated = '/dashboard' }: PublicRouteProps) {
  return (
    <AuthGuard requireAuth={false} redirectIfAuthenticated={redirectIfAuthenticated}>
      {children}
    </AuthGuard>
  );
} 