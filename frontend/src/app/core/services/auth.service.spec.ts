import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { of } from 'rxjs';
import { AuthService } from './auth.service';
import { ApiResponse, AuthResponse, User } from '../../data/models/auth.model';

describe('AuthService', () => {
    let service: AuthService;
    let httpMock: any;

    const mockUser: User = {
        id: 'u123',
        email: 'test@travel.com',
        fullName: 'Test User',
        role: 'TRAVELER',
        phone: '1234567890'
    };

    const mockAuthResponse: AuthResponse = {
        accessToken: 'fake-jwt-token',
        user: mockUser
    };

    beforeEach(() => {
        localStorage.clear();
        httpMock = {
            post: vi.fn(),
            get: vi.fn(),
            put: vi.fn(),
            delete: vi.fn(),
            verify: vi.fn()
        } as any;
        
        service = new AuthService(httpMock as any);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('login', () => {
        it('should send POST request and update session on success', () => {
            const credentials = { email: 'test@travel.com', password: 'password123' };
            const mockResponse: ApiResponse<AuthResponse> = {
                success: true,
                code: 'SUCCESS',
                message: 'Login successful',
                data: mockAuthResponse
            };

            (httpMock.post as any).mockReturnValue(of(mockResponse));

            service.login(credentials).subscribe((res) => {
                expect(res).toEqual(mockResponse);
                expect(service.isAuthenticated()).toBe(true);
                expect(service.currentUser()?.email).toEqual('test@travel.com');
                expect(localStorage.getItem('accessToken')).toEqual('fake-jwt-token');
                expect(JSON.parse(localStorage.getItem('currentUser') || '{}').email).toEqual('test@travel.com');
            });

            expect(httpMock.post).toHaveBeenCalledWith('/api/auth/login', credentials);
        });
    });

    describe('logout', () => {
        it('should clear session and localStorage', () => {
            // Setup initial state
            localStorage.setItem('accessToken', 'fake-jwt');
            localStorage.setItem('currentUser', JSON.stringify(mockUser));
            service.isAuthenticated.set(true);
            service.currentUser.set(mockUser);

            // Act
            service.logout();

            // Assert
            expect(service.isAuthenticated()).toBe(false);
            expect(service.currentUser()).toBeNull();
            expect(localStorage.getItem('accessToken')).toBeNull();
            expect(localStorage.getItem('currentUser')).toBeNull();
        });
    });

    describe('getToken', () => {
        it('should return token from localStorage', () => {
            localStorage.setItem('accessToken', 'my-secret-token');
            expect(service.getToken()).toEqual('my-secret-token');
        });

        it('should return null if token is not in localStorage', () => {
            localStorage.removeItem('accessToken');
            expect(service.getToken()).toBeNull();
        });
    });

    describe('loadSession', () => {
        it('should restore session from localStorage on initialization', () => {
            // Setup localStorage
            localStorage.setItem('accessToken', 'test-token');
            localStorage.setItem('currentUser', JSON.stringify(mockUser));

            // Create new instance to trigger loadSession
            const newService = new AuthService(httpMock as any);

            expect(newService.isAuthenticated()).toBe(true);
            expect(newService.currentUser()?.email).toEqual('test@travel.com');
        });
    });
});
