import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../data/models/auth.model';

export interface Promotion {
    id: string;
    code: string;
    description: string;
    discountPercent: number;
    maxDiscountAmount: number;
    validFrom: string;
    validTo: string;
    usageLimit: number;
    usedCount: number;
    active: boolean;
}

export interface Transaction {
    id: string;
    bookingId: string;
    amount: number;
    paymentMethod: string;
    transactionReference: string;
    status: string;
    createdAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    private readonly PROMO_URL = '/api/promotions';
    private readonly TXN_URL = '/api/transactions';

    constructor(private http: HttpClient) { }

    // Promotions
    getPromotions(): Observable<ApiResponse<Promotion[]>> {
        return this.http.get<ApiResponse<Promotion[]>>(this.PROMO_URL);
    }

    createPromotion(promo: any): Observable<ApiResponse<Promotion>> {
        return this.http.post<ApiResponse<Promotion>>(this.PROMO_URL, promo);
    }

    updatePromotion(id: string, promo: any): Observable<ApiResponse<Promotion>> {
        return this.http.put<ApiResponse<Promotion>>(`${this.PROMO_URL}/${id}`, promo);
    }

    deletePromotion(id: string): Observable<ApiResponse<void>> {
        return this.http.delete<ApiResponse<void>>(`${this.PROMO_URL}/${id}`);
    }

    applyPromotion(bookingId: string, promoCode: string): Observable<ApiResponse<void>> {
        return this.http.post<ApiResponse<void>>(`${this.PROMO_URL}/apply`, { bookingId, promoCode });
    }

    // Transactions
    getTransactions(): Observable<ApiResponse<Transaction[]>> {
        return this.http.get<ApiResponse<Transaction[]>>(this.TXN_URL);
    }

    processPayment(data: { bookingId: string, amount: number, paymentMethod: string }): Observable<ApiResponse<Transaction>> {
        return this.http.post<ApiResponse<Transaction>>(`${this.TXN_URL}/process`, data);
    }
}
