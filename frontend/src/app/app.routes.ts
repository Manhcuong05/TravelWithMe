import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'auth/login', loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent) },
    { path: 'auth/register', loadComponent: () => import('./features/auth/register.component').then(m => m.RegisterComponent) },
    { path: 'hotels', loadComponent: () => import('./features/catalog/hotel-list').then(m => m.HotelListComponent) },
    { path: 'hotels/:id', loadComponent: () => import('./features/catalog/hotel-detail').then(m => m.HotelDetailComponent) },
    { path: 'tours', loadComponent: () => import('./features/catalog/tour-list').then(m => m.TourListComponent) },
    { path: 'flights', loadComponent: () => import('./features/catalog/flight-list').then(m => m.FlightListComponent) },
    { path: 'pois', loadComponent: () => import('./features/catalog/poi-list').then(m => m.PoiListComponent) },
    { path: 'bookings', loadComponent: () => import('./features/booking/booking-list.component').then(m => m.BookingListComponent) },
    { path: 'bookings/:id', loadComponent: () => import('./features/booking/booking-detail.component').then(m => m.BookingDetailComponent) },
    { path: 'itinerary', loadComponent: () => import('./features/itinerary/itinerary').then(m => m.ItineraryComponent) },
    { path: '**', redirectTo: '' }
];
