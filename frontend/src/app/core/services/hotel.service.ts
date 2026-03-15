import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../data/models/auth.model';

export interface HotelRoom {
    id: string;
    roomType: string;
    pricePerNight: number;
    capacity: number;
    totalRooms: number;
    amenities: string[];
    classification?: string;
}

export interface Hotel {
    id: string;
    name: string;
    city: string;
    address: string;
    description: string;
    rating: number;
    starRating: number;
    imageUrl?: string;
    images?: string[];
    rooms?: HotelRoom[];
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

    createHotel(hotel: any): Observable<ApiResponse<Hotel>> {
        return this.http.post<ApiResponse<Hotel>>(this.API_URL, hotel);
    }

    updateHotel(id: string, hotel: any): Observable<ApiResponse<Hotel>> {
        return this.http.put<ApiResponse<Hotel>>(`${this.API_URL}/${id}`, hotel);
    }

    deleteHotel(id: string): Observable<ApiResponse<void>> {
        return this.http.delete<ApiResponse<void>>(`${this.API_URL}/${id}`);
    }

    addRoom(hotelId: string, room: any): Observable<ApiResponse<HotelRoom>> {
        return this.http.post<ApiResponse<HotelRoom>>(`${this.API_URL}/${hotelId}/rooms`, room);
    }

    updateRoom(roomId: string, room: any): Observable<ApiResponse<HotelRoom>> {
        return this.http.put<ApiResponse<HotelRoom>>(`/api/rooms/${roomId}`, room);
    }

    deleteRoom(roomId: string): Observable<ApiResponse<void>> {
        return this.http.delete<ApiResponse<void>>(`/api/rooms/${roomId}`);
    }
}
