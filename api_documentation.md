# TravelWithMe API Documentation

Tài liệu này hướng dẫn cách gọi các API hiện có của hệ thống TravelWithMe để phục vụ cho việc testing trên Postman hoặc các công cụ gọi API khác.

## Cấu trúc Response chung
Tất cả các API đều trả về dữ liệu dưới dạng JSON với cấu trúc:
```json
{
    "success": true,
    "message": "Thông báo thành công/thất bại",
    "data": { ... },
    "timestamp": "2024-..."
}
```

---

## 1. Authentication (Danh tính)
Cần thực hiện đăng ký/đăng nhập trước khi gọi các API yêu cầu quyền truy cập (Itinerary, Booking, Review, v.v.).

### Đăng ký tài khoản
- **URL:** `/api/auth/register`
- **Method:** `POST`
- **Body (JSON):**
```json
{
    "email": "user@example.com",
    "password": "password123",
    "fullName": "Nguyen Van A",
    "phone": "0912345678"
}
```

### Đăng nhập
- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Body (JSON):**
```json
{
    "email": "user@example.com",
    "password": "password123"
}
```
*Lưu ý: Sau khi đăng nhập thành công, bạn sẽ nhận được `accessToken`. Hãy sử dụng token này trong Header `Authorization: Bearer <token>` cho các API khác.*

---

## 2. Catalog (Tìm kiếm & Khám phá)
Các API này cho phép tìm kiếm thông tin dịch vụ.

### Tìm kiếm tổng hợp (Global Search)
- **URL:** `/api/search?query=Da Nang`
- **Method:** `GET`
- **Params:** `query` (tên thành phố, chuyến bay,...)

### Chuyến bay (Flights)
- **URL:** `/api/flights`
- **Method:** `GET`
- **Params:** `departure` (nơi đi), `arrival` (nơi đến)

### Khách sạn (Hotels)
- **URL:** `/api/hotels`
- **Method:** `GET`
- **Params:** `city`

### Chi tiết khách sạn
- **URL:** `/api/hotels/{id}`
- **Method:** `GET`

### Địa điểm tham quan (POIs)
- **URL:** `/api/pois`
- **Method:** `GET`
- **Params:** `city`

### Tour du lịch
- **URL:** `/api/tours`
- **Method:** `GET`
- **Params:** `location`

---

## 3. AI Itinerary (Lịch trình thông minh)
*(Yêu cầu Bearer Token)*

### Tạo lịch trình AI
- **URL:** `/api/itineraries/generate`
- **Method:** `POST`
- **Params:** 
    - `destination`: Tên điểm đến
    - `days`: Số ngày (int)
    - `preferences`: Sở thích (tùy chọn)

### Danh sách lịch trình của tôi
- **URL:** `/api/itineraries/my`
- **Method:** `GET`

---

## 4. Booking (Đặt hàng)
*(Yêu cầu Bearer Token)*

### Tạo đơn hàng (Booking)
- **URL:** `/api/bookings`
- **Method:** `POST`
- **Body (JSON):**
```json
{
    "items": [
        {
            "type": "HOTEL",
            "serviceId": "hotel-id-123",
            "quantity": 2
        }
    ]
}
```

### Hủy đơn hàng
- **URL:** `/api/bookings/{id}/cancel`
- **Method:** `POST`

---

## 5. Review (Đánh giá)
*(Yêu cầu Bearer Token)*

### Gửi đánh giá
- **URL:** `/api/reviews`
- **Method:** `POST`
- **Params:**
    - `serviceId`: ID của dịch vụ (Hotel/Tour/...)
    - `rating`: Số sao (1-5)
    - `comment`: Nhận xét (tùy chọn)

### Xem đánh giá của dịch vụ
- **URL:** `/api/reviews/service/{serviceId}`
- **Method:** `GET`

---

## 6. Payment (Thanh toán)
*(Yêu cầu Bearer Token)*

### Khởi tạo thanh toán
- **URL:** `/api/payments/init/{bookingId}`
- **Method:** `POST`

---

## 7. Admin (Quản trị hệ thống)
*(Chỉ dành cho ADMIN - Sử dụng token của tài khoản admin@travel.com)*

### Tạo tài khoản CTV (Business Manager)
- **URL:** `/api/admin/ctv`
- **Method:** `POST`
- **Body (JSON):** 
```json
{
    "email": "ctv1@travel.com",
    "password": "password123",
    "fullName": "Nguyen Manager",
    "phone": "0987654321"
}
```

### Xem danh sách tất cả người dùng
- **URL:** `/api/admin/users`
- **Method:** `GET`

### Xóa người dùng
- **URL:** `/api/admin/users/{id}`
- **Method:** `DELETE`
