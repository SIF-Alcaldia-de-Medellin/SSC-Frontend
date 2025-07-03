import { useState, useEffect } from 'react';
import { useAuth as useAuthContext } from '@/context/AuthContext';
import { authService, LoginCredentials } from '@/services/authService';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
    const { login: contextLogin, logout: contextLogout, isAuthenticated, user } = useAuthContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // Si ya hay un usuario en el contexto, no necesitamos validar
                if (isAuthenticated && user) {
                    setIsInitialized(true);
                    return;
                }
                
                const token = localStorage.getItem('token');
                if (token) {
                    // Validar token con el backend
                    const user = await authService.getCurrentUser(token);
                    contextLogin(user, token);
                }
            } catch {
                // Token inválido, limpiar localStorage
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            } finally {
                setIsInitialized(true);
            }
        };

        initializeAuth();
    }, [contextLogin, isAuthenticated, user]);

    const login = async (credentials: LoginCredentials) => {
        setLoading(true);
        setError(null);
        
        try {
            const { access_token: token, user } = await authService.login(credentials);
            contextLogin(user, token);
            const pathTo = (!user.mustChangePassword) ? '/' : '/update-password';
            console.log(pathTo);
            router.push('/');
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Error de autenticación';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try{
            setLoading(true);
            contextLogout();
        } catch (err: unknown) {
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { login, logout, loading, error, isInitialized, isAuthenticated, user };
};