export interface User {
    id: string;
    email: string;
    fullName: string;
    role: 'ADMIN' | 'CTV' | 'TRAVELER';
    phone?: string;
    avatarUrl?: string;
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
