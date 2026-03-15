import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { managementGuard } from './core/guards/management.guard';

export const routes: Routes = [
    { path: "", loadComponent: () => import("./features/home/home").then(m => m.HomeComponent) },
    { path: "auth/login", loadComponent: () => import("./features/auth/login.component").then(m => m.LoginComponent) },
    { path: "auth/register", loadComponent: () => import("./features/auth/register.component").then(m => m.RegisterComponent) },
    { path: "hotels", loadComponent: () => import("./features/catalog/hotel-list").then(m => m.HotelListComponent) },
    { path: "hotels/:id", loadComponent: () => import("./features/catalog/hotel-detail").then(m => m.HotelDetailComponent) },
    { path: "tours", loadComponent: () => import("./features/catalog/tour-list").then(m => m.TourListComponent) },
    { path: "tours/:id", loadComponent: () => import("./features/catalog/tour-detail").then(m => m.TourDetailComponent) },
    { path: "flights", loadComponent: () => import("./features/catalog/flight-list").then(m => m.FlightListComponent) },
    { path: "pois", loadComponent: () => import("./features/catalog/poi-list").then(m => m.PoiListComponent) },
    { path: "bookings", loadComponent: () => import("./features/booking/booking-list.component").then(m => m.BookingListComponent) },
    { path: "bookings/:id", loadComponent: () => import("./features/booking/booking-detail.component").then(m => m.BookingDetailComponent) },
    { path: "itinerary", loadComponent: () => import("./features/itinerary/itinerary").then(m => m.ItineraryComponent) },
    {
        path: "management",
        loadComponent: () => import("./features/admin/layout/admin-layout").then(m => m.AdminLayoutComponent),
        canActivate: [managementGuard],
        children: [
            { path: "", loadComponent: () => import("./features/admin/dashboard/dashboard").then(m => m.DashboardComponent) },
            {
                path: "users",
                canActivate: [adminGuard],
                loadComponent: () => import("./features/admin/users/user-list").then(m => m.UserListComponent)
            },
            { path: "tours", loadComponent: () => import("./features/admin/services/tour-mgmt").then(m => m.TourMgmtComponent) },
            { path: "hotels", loadComponent: () => import("./features/admin/services/hotel-mgmt").then(m => m.HotelMgmtComponent) },
            { path: "hotel-rooms", loadComponent: () => import("./features/admin/services/hotel-room-mgmt").then(m => m.HotelRoomMgmtComponent) },
            { path: "flights", loadComponent: () => import("./features/admin/services/flight-mgmt").then(m => m.FlightMgmtComponent) },
            { path: "pois", loadComponent: () => import("./features/admin/services/poi-mgmt").then(m => m.PoiMgmtComponent) },
            { path: "bookings", loadComponent: () => import("./features/admin/bookings/booking-mgmt").then(m => m.BookingMgmtComponent) },
            { path: "promotions", loadComponent: () => import("./features/admin/payment/promotion-mgmt").then(m => m.PromotionMgmtComponent) },
            { path: "transactions", loadComponent: () => import("./features/admin/payment/transaction-mgmt").then(m => m.TransactionMgmtComponent) }
        ]
    },
    { path: "**", redirectTo: "" }
];
