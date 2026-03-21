import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../data/models/auth.model';

export interface BookingItem {
    id: string;
    type?: string;
    serviceType?: string;
    serviceId: string;
    quantity: number;
    checkInDate?: string;
    checkOutDate?: string;
    price?: number;
}

export interface BookingRequest {
    items: {
        type: string;
        serviceId: string;
        quantity: number;
        checkInDate?: string;
        checkOutDate?: string;
    }[];
    contact?: {
        name: string;
        phone: string;
        email: string;
    };
    passengers?: {
        title: string;
        lastName: string;
        firstName: string;
        dob?: string;
        nationality: string;
    }[];
    addons?: {
        baggage: number;
        meals: boolean;
        seat: boolean;
        insurance: boolean;
    };
}

export interface BookingResponse {
    id: string;
    userId: string;
    totalAmount: number;
    status: string;
    items: BookingItem[];
    createdAt: string;
    contact?: {
        name: string;
        phone: string;
        email: string;
    };
    passengers?: {
        title: string;
        lastName: string;
        firstName: string;
        dob: string;
        nationality: string;
    }[];
}

@Injectable({
    providedIn: 'root'
})
export class BookingService {
    private readonly API_URL = '/api/bookings';

    constructor(private http: HttpClient) { }

    createBooking(request: BookingRequest): Observable<ApiResponse<BookingResponse>> {
        return this.http.post<ApiResponse<BookingResponse>>(this.API_URL, request);
    }

    getMyBookings(): Observable<ApiResponse<BookingResponse[]>> {
        return this.http.get<ApiResponse<BookingResponse[]>>(this.API_URL);
    }

    getBooking(id: string): Observable<ApiResponse<BookingResponse>> {
        return this.http.get<ApiResponse<BookingResponse>>(`${this.API_URL}/${id}`);
    }

    cancelBooking(id: string): Observable<ApiResponse<any>> {
        return this.http.post<ApiResponse<any>>(`${this.API_URL}/${id}/cancel`, {});
    }

    // New for management
    updateStatus(id: string, status: string): Observable<ApiResponse<any>> {
        // Assuming there might be a status endpoint or similar. 
        // If not, we use this as a placeholder for future backend development.
        return this.http.put<ApiResponse<any>>(`${this.API_URL}/${id}/status`, { status });
    }
}
