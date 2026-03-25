import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ApiResponse, AuthResponse, User } from '../../data/models/auth.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly AUTH_URL = '/api/auth';
    private readonly TOKEN_KEY = 'accessToken';
    private readonly USER_KEY = 'currentUser';

    public currentUser = signal<User | null>(null);
    public isAuthenticated = signal<boolean>(false);

    constructor(private http: HttpClient) {
        this.loadSession();
    }

    private loadSession() {
        const token = localStorage.getItem(this.TOKEN_KEY);
        const userJson = localStorage.getItem(this.USER_KEY);
        if (token && userJson) {
            this.isAuthenticated.set(true);
            try {
                this.currentUser.set(JSON.parse(userJson));
            } catch (e) {
                this.logout();
            }
        }
    }

    login(credentials: any): Observable<ApiResponse<AuthResponse>> {
        return this.http.post<ApiResponse<AuthResponse>>(`${this.AUTH_URL}/login`, credentials).pipe(
            tap(res => {
                if (res.success && res.data.accessToken) {
                    localStorage.setItem(this.TOKEN_KEY, res.data.accessToken);
                    if (res.data.user) {
                        localStorage.setItem(this.USER_KEY, JSON.stringify(res.data.user));
                        this.currentUser.set(res.data.user);
                    }
                    this.isAuthenticated.set(true);
                }
            })
        );
    }

    loginWithGoogle(idToken: string): Observable<ApiResponse<AuthResponse>> {
        return this.http.post<ApiResponse<AuthResponse>>(`${this.AUTH_URL}/google`, { idToken }).pipe(
            tap(res => {
                if (res.success && res.data.accessToken) {
                    localStorage.setItem(this.TOKEN_KEY, res.data.accessToken);
                    if (res.data.user) {
                        localStorage.setItem(this.USER_KEY, JSON.stringify(res.data.user));
                        this.currentUser.set(res.data.user);
                    }
                    this.isAuthenticated.set(true);
                }
            })
        );
    }

    sendLoginOtp(email: string): Observable<ApiResponse<void>> {
        return this.http.post<ApiResponse<void>>(`${this.AUTH_URL}/send-login-otp`, { email });
    }

    loginWithOtp(email: string, code: string): Observable<ApiResponse<AuthResponse>> {
        return this.http.post<ApiResponse<AuthResponse>>(`${this.AUTH_URL}/login-otp`, { email, code }).pipe(
            tap(res => {
                if (res.success && res.data.accessToken) {
                    localStorage.setItem(this.TOKEN_KEY, res.data.accessToken);
                    if (res.data.user) {
                        localStorage.setItem(this.USER_KEY, JSON.stringify(res.data.user));
                        this.currentUser.set(res.data.user);
                    }
                    this.isAuthenticated.set(true);
                }
            })
        );
    }

    sendPasswordResetOtp(email: string): Observable<ApiResponse<void>> {
        return this.http.post<ApiResponse<void>>(`${this.AUTH_URL}/forgot-password`, { email });
    }

    resetPassword(data: any): Observable<ApiResponse<void>> {
        return this.http.post<ApiResponse<void>>(`${this.AUTH_URL}/reset-password`, data);
    }

    register(userData: any): Observable<ApiResponse<any>> {
        return this.http.post<ApiResponse<any>>(`${this.AUTH_URL}/register`, userData);
    }

    logout() {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        this.isAuthenticated.set(false);
        this.currentUser.set(null);
    }

    updateProfile(data: any): Observable<ApiResponse<User>> {
        return this.http.put<ApiResponse<User>>('/api/users/profile', data).pipe(
            tap(res => {
                if (res.success) {
                    this.currentUser.set(res.data);
                    localStorage.setItem(this.USER_KEY, JSON.stringify(res.data));
                }
            })
        );
    }

    uploadAvatar(file: File): Observable<ApiResponse<string>> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<ApiResponse<string>>('/api/upload', formData);
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }
}
