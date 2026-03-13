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

    public currentUser = signal<User | null>(null);
    public isAuthenticated = signal<boolean>(false);

    constructor(private http: HttpClient) {
        this.loadSession();
    }

    private loadSession() {
        const token = localStorage.getItem(this.TOKEN_KEY);
        if (token) {
            this.isAuthenticated.set(true);
            // In a real app, we might want to fetch user profile here
        }
    }

    login(credentials: any): Observable<ApiResponse<AuthResponse>> {
        return this.http.post<ApiResponse<AuthResponse>>(`${this.AUTH_URL}/login`, credentials).pipe(
            tap(res => {
                if (res.success && res.data.accessToken) {
                    localStorage.setItem(this.TOKEN_KEY, res.data.accessToken);
                    this.isAuthenticated.set(true);
                    if (res.data.user) this.currentUser.set(res.data.user);
                }
            })
        );
    }

    register(userData: any): Observable<ApiResponse<any>> {
        return this.http.post<ApiResponse<any>>(`${this.AUTH_URL}/register`, userData);
    }

    logout() {
        localStorage.removeItem(this.TOKEN_KEY);
        this.isAuthenticated.set(false);
        this.currentUser.set(null);
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }
}
