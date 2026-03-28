import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../../data/models/auth.model';
import { Observable, tap } from 'rxjs';

export interface FavoriteRequest {
  itemType: 'TOUR' | 'HOTEL' | 'POI' | 'ITINERARY';
  itemId: String;
}

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private http = inject(HttpClient);
  private apiUrl = '/api/favorites';

  toggleFavorite(request: FavoriteRequest): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/toggle`, request);
  }

  getFavoriteStatus(type: string, id: string): Observable<ApiResponse<boolean>> {
    return this.http.get<ApiResponse<boolean>>(`${this.apiUrl}/status`, {
      params: { type, id }
    });
  }

  getAllFavorites(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/all`);
  }
}
