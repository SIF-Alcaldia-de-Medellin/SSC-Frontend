export interface Usuario {
    cedula: string;
    email: string;
    rol: string;
    nombre: string;
    mustChangePassword: boolean;
    lastPasswordChange?: boolean;
}