import { apiClient } from './api';
import { Usuario } from '@/types/usuario';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    access_token: string;
    user: Usuario;
    mustChangePassword: boolean;
}

export interface RegisterCredentials {
    cedula: string,
    email: string,
    password: string,
    rol: string,
    nombre: string
}

export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        return apiClient.post('/auth/login', credentials);
    },

    async register(credentials: RegisterCredentials): Promise<void> {
        return apiClient.post('/auth/register', credentials);
    },

    async getCurrentUser(token: string): Promise<Usuario> {
        return apiClient.get('/usuarios/perfil/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    },

    async updatePasswordFirstTime(body: {newPassword: string}): Promise<void>{
        return apiClient.post('/auth/first-login-change-password', body);
    }
};