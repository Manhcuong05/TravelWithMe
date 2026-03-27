import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../data/models/auth.model';

export interface ItineraryDay {
    day: number;
    activities: {
        time: string;
        activity: string;
        location: string;
        notes?: string;
    }[];
}

export interface ItineraryResponse {
    id?: string;
    title: string;
    destination: string;
    durationDays: number;
    userPreferences?: string;
    days: ItineraryDay[];
    recommendations?: Recommendation[];
    saved?: boolean;
}

export interface Recommendation {
    id: string;
    type: 'TOUR' | 'HOTEL' | 'POI';
    name: string;
    imageUrl?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ItineraryService {
    private readonly API_URL = '/api/itineraries';

    constructor(private http: HttpClient) { }

    generate(data: { destination: string, days: number, preferences?: string }): Observable<ApiResponse<ItineraryResponse>> {
        return this.http.post<ApiResponse<ItineraryResponse>>(`${this.API_URL}/generate`, data);
    }

    getMyItineraries(): Observable<ApiResponse<ItineraryResponse[]>> {
        return this.http.get<ApiResponse<ItineraryResponse[]>>(`${this.API_URL}/my`);
    }

    save(id: string): Observable<ApiResponse<ItineraryResponse>> {
        return this.http.put<ApiResponse<ItineraryResponse>>(`${this.API_URL}/${id}/save`, {});
    }

    getById(id: string): Observable<ApiResponse<ItineraryResponse>> {
        return this.http.get<ApiResponse<ItineraryResponse>>(`${this.API_URL}/${id}`);
    }
}
