import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, User } from '../../data/models/auth.model';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private readonly API_URL = '/api/admin';

    constructor(private http: HttpClient) { }

    getAllUsers(): Observable<ApiResponse<User[]>> {
        return this.http.get<ApiResponse<User[]>>(`${this.API_URL}/users`);
    }

    createCTV(userData: any): Observable<ApiResponse<User>> {
        return this.http.post<ApiResponse<User>>(`${this.API_URL}/ctv`, userData);
    }

    deleteUser(id: string): Observable<ApiResponse<void>> {
        return this.http.delete<ApiResponse<void>>(`${this.API_URL}/users/${id}`);
    }
}
