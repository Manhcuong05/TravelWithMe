# QUẢN LÝ LỖI (Bug Management) - Bug Log

**Dự án:** TravelWithMe Backend  
**Thời gian kiểm thử:** 2026-03-18  
**Tổng số lỗi phát hiện:** 8

---

## Danh Sách Bug

| Bug# | Tiêu đề | Module | Mức độ | Trạng thái | Phát hiện qua |
|---|---|---|---|---|---|
| BUG-001 | TourServiceTest - Message lỗi không khớp với production code | TourService | Thấp | ✅ Đã sửa | Unit Test |
| BUG-002 | TravelApplicationTests cần DB thật để chạy (fail CI/CD) | Testing | Trung bình | 🔄 Cần xử lý | Static Analysis |
| BUG-003 | URL VietQR hardcode trong PaymentService | Payment | Trung bình | 🔄 Cần xử lý | Code Review |
| BUG-004 | BookingService không xử lý trường hợp Flight không tồn tại | Booking | Cao | ✅ Đã sửa | Black Box Test |
| BUG-005 | Thiếu validation ngày bay trong FlightService | Catalog | Trung bình | 🔄 Backlog | Black Box Test |
| BUG-006 | ReviewService có thể tạo review trùng lặp (không check duplicate) | Review | Trung bình | 🔄 Backlog | White Box Test |
| BUG-007 | API trả về stack trace khi có lỗi server (information disclosure) | Core | Cao | 🔄 Cần xử lý | Manual Testing |
| BUG-008 | Magic number `1` cho default_nights trong BookingService | Booking | Thấp | 🔄 Backlog | Code Review |

---

## Chi Tiết Các Bug

### BUG-004: BookingService không xử lý Flight không tồn tại
- **Môi trường:** Localhost, Postman
- **Các bước tái hiện:**
  1. Gọi `POST /api/bookings` với `type: "FLIGHT"`, `serviceId: "nonexistent-flight"`
  2. Quan sát response
- **Kết quả thực tế:** `{"code":"SERVICE_NOT_FOUND","message":"Không tìm thấy chuyến bay"}`
- **Kết quả mong đợi:** Mã lỗi trả về phải đi kèm với Flight ID cụ thể để debug.
- **Mức độ:** Cao
- **Trạng thái:** ✅ Đã ghi nhận

### BUG-007: API lộ Stack Trace
- **Môi trường:** Chrome Browser / Postman
- **Các bước tái hiện:**
  1. Gây lỗi Runtime (ví dụ: chia cho 0 hoặc gọi API với data lỗi cấu trúc nặng)
  2. Xem nội dung phản hồi
- **Kết quả thực tế:** Trả về toàn bộ Java Stack Trace dài dòng.
- **Kết quả mong đợi:** Trả về đối tượng JSON lỗi chuẩn (timestamp, code, message) thân thiện.
- **Mức độ:** Cao
- **Trạng thái:** 🔄 Cần xử lý

### BUG-003: URL VietQR hardcode trong PaymentService
- **Môi trường:** Code Review
- **Kết quả thực tế:** URL ảnh QR đang nằm cứng trong code Java.
- **Kết quả mong đợi:** Phải cấu hình trong `application.yml`.
- **Mức độ:** Trung bình
- **Trạng thái:** 🔄 Cần xử lý

---

## Thống Kê

| Mức độ | Số lượng |
|---|---|
| 🔴 Cao | 2 |
| 🟡 Trung bình | 4 |
| 🟢 Thấp | 2 |

| Trạng thái | Số lượng |
|---|---|
| ✅ Đã sửa | 2 |
| 🔄 Cần xử lý | 4 |
| 📋 Backlog | 2 |
