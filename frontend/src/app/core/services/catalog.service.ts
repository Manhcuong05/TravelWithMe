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

export interface FlightClass {
    id: string;
    className: string;
    priceAdult: number;
    priceChild: number;
    priceInfant: number;
    totalSeats: number;
    availableSeats: number;
    baggageAllowanceKg: number;
}

export interface Flight {
    id: string;
    flightNumber: string;
    airline: string;
    departureCity: string;
    arrivalCity: string;
    flightClasses?: FlightClass[];
    departureTime: string;
    arrivalTime: string;
    aircraft?: string;
    departureAirport?: string;
    arrivalAirport?: string;
}

export interface POI {
    id: string;
    name: string;
    description: string;
    category: string;
    city: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    averageSpend?: number;
    imageUrl?: string;
    imagesJson?: string;
    rating?: number;
    region?: string;
    bestTimeToVisit?: string;
    tips?: string;
    handbookJson?: string;
}

export type PointOfInterest = POI;

export type { Hotel } from './hotel.service';

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

    getFlight(id: string): Observable<ApiResponse<Flight>> {
        return this.http.get<ApiResponse<Flight>>(`/api/flights/${id}`);
    }

    getPOIs(city?: string): Observable<ApiResponse<POI[]>> {
        const params: any = {};
        if (city) params.city = city;
        return this.http.get<ApiResponse<POI[]>>('/api/pois', { params });
    }

    // Management Methods
    createTour(tour: any): Observable<ApiResponse<Tour>> {
        return this.http.post<ApiResponse<Tour>>('/api/tours', tour);
    }

    updateTour(id: string, tour: any): Observable<ApiResponse<Tour>> {
        return this.http.put<ApiResponse<Tour>>(`/api/tours/${id}`, tour);
    }

    deleteTour(id: string): Observable<ApiResponse<void>> {
        return this.http.delete<ApiResponse<void>>(`/api/tours/${id}`);
    }

    createFlight(flight: any): Observable<ApiResponse<Flight>> {
        return this.http.post<ApiResponse<Flight>>('/api/flights', flight);
    }

    updateFlight(id: string, flight: any): Observable<ApiResponse<Flight>> {
        return this.http.put<ApiResponse<Flight>>(`/api/flights/${id}`, flight);
    }

    deleteFlight(id: string): Observable<ApiResponse<void>> {
        return this.http.delete<ApiResponse<void>>(`/api/flights/${id}`);
    }

    createPOI(poi: any): Observable<ApiResponse<POI>> {
        return this.http.post<ApiResponse<POI>>('/api/pois', poi);
    }

    updatePOI(id: string, poi: any): Observable<ApiResponse<POI>> {
        return this.http.put<ApiResponse<POI>>(`/api/pois/${id}`, poi);
    }

    deletePOI(id: string): Observable<ApiResponse<void>> {
        return this.http.delete<ApiResponse<void>>(`/api/pois/${id}`);
    }

    uploadFile(file: File): Observable<ApiResponse<string>> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<ApiResponse<string>>('/api/upload', formData);
    }
}
