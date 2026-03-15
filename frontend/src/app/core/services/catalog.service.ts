import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../data/models/auth.model';

export interface Tour {
    id: string;
    title: string;
    location: string;
    price: number;
    duration: string;
    imageUrl?: string;
    description: string;
    durationDays?: number;
    highlights?: string[];
    hotelId?: string;
    flightId?: string;
    poiIds?: string[];
    aiSuggestions?: string;
}

export interface Flight {
    id: string;
    flightNumber: string;
    airline: string;
    departure: string;
    arrival: string;
    price: number;
    departureTime: string;
}

export interface POI {
    id: string;
    name: string;
    city: string;
    description: string;
    category: string;
    imageUrl?: string;
}

@Injectable({
    providedIn: 'root'
})
export class CatalogService {
    constructor(private http: HttpClient) { }

    getTours(location?: string): Observable<ApiResponse<Tour[]>> {
        const params: any = {};
        if (location) params.location = location;
        return this.http.get<ApiResponse<Tour[]>>('/api/tours', { params });
    }

    getTour(id: string): Observable<ApiResponse<Tour>> {
        return this.http.get<ApiResponse<Tour>>(`/api/tours/item/${id}`);
    }

    getFlights(departure?: string, arrival?: string): Observable<ApiResponse<Flight[]>> {
        const params: any = {};
        if (departure) params.departure = departure;
        if (arrival) params.arrival = arrival;
        return this.http.get<ApiResponse<Flight[]>>('/api/flights', { params });
    }

    getPOIs(city?: string): Observable<ApiResponse<POI[]>> {
        const params: any = {};
        if (city) params.city = city;
        return this.http.get<ApiResponse<POI[]>>('/api/pois', { params });
    }
}
