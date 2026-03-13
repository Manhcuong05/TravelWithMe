export interface User {
    id: string;
    email: string;
    fullName: string;
    role: 'ADMIN' | 'CTV' | 'TRAVELER';
}

export interface AuthResponse {
    accessToken: string;
    user?: User;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    code?: string;
}
