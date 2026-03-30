import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { of } from 'rxjs';
import { PaymentService, Promotion, Transaction } from './payment.service';
import { ApiResponse } from '../../data/models/auth.model';

describe('PaymentService', () => {
    let service: PaymentService;
    let httpMock: any;

    const mockPromotion: Promotion = {
        id: 'promo1',
        code: 'SUMMER2026',
        description: 'Summer sale',
        discountPercent: 10,
        maxDiscountAmount: 500000,
        validFrom: '2026-06-01',
        validTo: '2026-08-31',
        usageLimit: 100,
        usedCount: 5,
        active: true
    };

    const mockTransaction: Transaction = {
        id: 'tx1',
        bookingId: 'booking123',
        amount: 5000000,
        paymentMethod: 'VietQR',
        transactionReference: 'TRV123',
        status: 'SUCCESS',
        createdAt: '2026-03-30T10:00:00Z'
    };

    beforeEach(() => {
        httpMock = {
            get: vi.fn(),
            post: vi.fn(),
            put: vi.fn(),
            delete: vi.fn(),
            verify: vi.fn()
        } as any;

        service = new PaymentService(httpMock as any);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('Promotions', () => {
        it('should get all promotions', () => {
            const mockResponse: ApiResponse<Promotion[]> = {
                success: true,
                code: 'SUCCESS',
                message: 'Success',
                data: [mockPromotion]
            };

            (httpMock.get as any).mockReturnValue(of(mockResponse));

            service.getPromotions().subscribe(res => {
                expect(res.data?.length).toBe(1);
                expect(res.data).toEqual([mockPromotion]);
            });

            expect(httpMock.get).toHaveBeenCalledWith('/api/promotions');
        });

        it('should apply promotion to booking', () => {
            const mockResponse: ApiResponse<void> = {
                success: true,
                code: 'SUCCESS',
                message: 'Promotion applied',
                data: null as any
            };

            (httpMock.post as any).mockReturnValue(of(mockResponse));

            service.applyPromotion('booking123', 'SUMMER2026').subscribe(res => {
                expect(res.success).toBe(true);
            });

            expect(httpMock.post).toHaveBeenCalledWith('/api/promotions/apply', { bookingId: 'booking123', promoCode: 'SUMMER2026' });
        });
    });

    describe('Transactions', () => {
        it('should get all transactions', () => {
            const mockResponse: ApiResponse<Transaction[]> = {
                success: true,
                code: 'SUCCESS',
                message: 'Success',
                data: [mockTransaction]
            };

            (httpMock.get as any).mockReturnValue(of(mockResponse));

            service.getTransactions().subscribe(res => {
                expect(res.data?.length).toBe(1);
                expect(res.data).toEqual([mockTransaction]);
            });

            expect(httpMock.get).toHaveBeenCalledWith('/api/transactions');
        });

        it('should process payment', () => {
            const mockResponse: ApiResponse<Transaction> = {
                success: true,
                code: 'SUCCESS',
                message: 'Success',
                data: mockTransaction
            };

            (httpMock.post as any).mockReturnValue(of(mockResponse));

            const payload = { bookingId: 'booking123', amount: 5000000, paymentMethod: 'VietQR' };

            service.processPayment(payload).subscribe(res => {
                expect(res.data).toEqual(mockTransaction);
            });

            expect(httpMock.post).toHaveBeenCalledWith('/api/transactions/process', payload);
        });
    });
});
