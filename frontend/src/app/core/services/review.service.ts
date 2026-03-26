import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../data/models/auth.model';

export interface ReviewRequest {
    serviceId: string;
    serviceType: string;
    rating: number;
    comment: string;
}

export interface ReviewResponse {
    id: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class ReviewService {
    private readonly API_URL = '/api/reviews';

    constructor(private http: HttpClient) { }

    createReview(request: ReviewRequest): Observable<ApiResponse<ReviewResponse>> {
        return this.http.post<ApiResponse<ReviewResponse>>(this.API_URL, request);
    }

    getServiceReviews(serviceId: string, type: string): Observable<ApiResponse<ReviewResponse[]>> {
        return this.http.get<ApiResponse<ReviewResponse[]>>(`${this.API_URL}/service/${serviceId}`, {
            params: { type }
        });
    }

    canReview(serviceId: string, serviceType: string): Observable<ApiResponse<{ canReview: boolean }>> {
        return this.http.get<ApiResponse<{ canReview: boolean }>>(`${this.API_URL}/can-review`, {
            params: { serviceId, serviceType }
        });
    }
}
