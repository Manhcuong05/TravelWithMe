import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../data/models/auth.model';

export interface BookingItem {
    id: string;
    type: string;
    serviceId: string;
    quantity: number;
}

export interface BookingRequest {
    items: {
        type: string;
        serviceId: string;
        quantity: number;
    }[];
}

export interface BookingResponse {
    id: string;
    userId: string;
    totalAmount: number;
    status: string;
    items: BookingItem[];
    createdAt: string;
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
}
