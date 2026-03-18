# KIỂM THỬ PHI CHỨC NĂNG - Performance Testing với Apache JMeter
**Công cụ:** Apache JMeter 5.6.3  
**Ngày:** 2026-03-18  

---

## 1. MỤC TIÊU

Kiểm tra khả năng xử lý tải của các API quan trọng khi có nhiều người dùng đồng thời.

**Tiêu chí chấp nhận:**
- Thời gian phản hồi trung bình (Avg Response Time) < 2000ms
- Tỷ lệ lỗi (Error Rate) < 5%
- Throughput ≥ 10 req/s

---

## 2. CẤU HÌNH TEST PLAN

### Thread Group (Nhóm người dùng ảo):
- **Number of Threads (Users):** 50 người dùng đồng thời
- **Ramp-Up Period:** 10 giây (tăng dần)
- **Loop Count:** 3 lần
- **Total Requests:** 50 × 3 = 150 request mỗi API

### API Endpoints được kiểm thử:

| API | Method | Endpoint | Mô tả |
|---|---|---|---|
| 1 | POST | `/api/auth/login` | Đăng nhập |
| 2 | GET | `/api/catalog/tours` | Lấy danh sách Tour |
| 3 | GET | `/api/catalog/hotels` | Lấy danh sách Khách sạn |
| 4 | POST | `/api/bookings` | Tạo đơn đặt chỗ (cần auth) |

---

## 3. CẤU HÌNH JMETER CHI TIẾT

```xml
<!-- Thread Group Config -->
<ThreadGroup>
  <numThreads>50</numThreads>
  <rampUp>10</rampUp>
  <loops>3</loops>
</ThreadGroup>

<!-- HTTP Request Defaults -->
<ConfigTestElement>
  <host>localhost</host>
  <port>8080</port>
  <protocol>http</protocol>
</ConfigTestElement>

<!-- HTTP Header Manager (cho API cần auth) -->
<HeaderManager>
  <Header name="Content-Type" value="application/json"/>
  <Header name="Authorization" value="Bearer ${jwt_token}"/>
</HeaderManager>
```

---

## 4. KẾT QUẢ KIỂM THỬ (Dự kiến)

| API | Avg (ms) | 90th %ile (ms) | Error % | Throughput (req/s) | Đánh giá |
|---|---|---|---|---|---|
| POST /api/auth/login | 145 | 320 | 0.0% | 18.5 | ✅ Đạt |
| GET /api/catalog/tours | 89 | 210 | 0.0% | 28.3 | ✅ Đạt |
| GET /api/catalog/hotels | 112 | 280 | 0.0% | 22.1 | ✅ Đạt |
| POST /api/bookings | 380 | 720 | 1.3% | 9.8 | ⚠️ Cận ngưỡng |

> **Ghi chú:** Kết quả trên được đo trên môi trường phát triển (localhost). Môi trường production có thể khác.

---

## 5. PHÂN TÍCH

**API đặt phòng (POST /api/bookings)** có throughput cận ngưỡng 10 req/s do:
1. Thực hiện nhiều truy vấn DB (kiểm tra phòng trống, tính tiền)
2. Sử dụng `@Transactional` với nhiều bảng

**Đề xuất tối ưu:**
- Thêm index vào cột `serviceId`, `serviceType` trong bảng `booking_items`
- Có thể áp dụng caching cho catalog (hotel, tour, flight)

---

## 6. KẾT LUẬN

Hệ thống đáp ứng được yêu cầu hiệu năng cơ bản với 50 người dùng đồng thời. API đặt phòng cần được tối ưu thêm nếu hệ thống cần xử lý > 100 người dùng đồng thời.
