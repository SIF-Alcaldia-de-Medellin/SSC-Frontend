"use client";

import AuthGuard from './AuthGuard';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({ children, redirectTo = '/login' }: ProtectedRouteProps) {
  return (
    <AuthGuard requireAuth={true} redirectTo={redirectTo}>
      {children}
    </AuthGuard>
  );
} 