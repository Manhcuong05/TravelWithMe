import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../data/models/auth.model';

export interface Hotel {
    id: string;
    name: string;
    city: string;
    address: string;
    description: string;
    rating: number;
    basePrice: number;
    imageUrl?: string;
}

@Injectable({
    providedIn: 'root'
})
export class HotelService {
    private readonly API_URL = '/api/hotels';

    constructor(private http: HttpClient) { }

    getHotels(city?: string): Observable<ApiResponse<Hotel[]>> {
        const params: any = {};
        if (city) params.city = city;
        return this.http.get<ApiResponse<Hotel[]>>(this.API_URL, { params });
    }

    getHotel(id: string): Observable<ApiResponse<Hotel>> {
        return this.http.get<ApiResponse<Hotel>>(`${this.API_URL}/${id}`);
    }
}
