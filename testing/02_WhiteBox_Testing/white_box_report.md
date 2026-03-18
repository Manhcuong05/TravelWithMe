# PHẦN B: KIỂM THỬ HỘP TRẮNG (White Box Testing)

**Dự án:** TravelWithMe  
**Công cụ:** JUnit 5, Mockito  
**Ngày thực hiện:** 2026-03-18  

---

## 1. MỤC TIÊU & PHẠM VI

Kiểm thử hộp trắng tập trung vào cấu trúc mã nguồn bên trong của các Service quan trọng nhất trong hệ thống Backend. Mục tiêu là đảm bảo mọi dòng code, mọi nhánh rẽ nhánh (if/else, switch) và các trường hợp ngoại lệ (Exceptions) đều được thực thi đúng.

---

## 2.DANH SÁCH CÁC TEST CLASS

Nhóm đã xây dựng 5 bộ kiểm thử chính:

| Test Class | Đối tượng kiểm thử | Số Test Cases | Độ phủ mục tiêu |
|---|---|---|---|
| [AuthServiceTest](file:///home/ngcuong/Data/TraveWithMe/backend/src/test/java/com/example/travel/identity/service/AuthServiceTest.java) | Đăng ký, Đăng nhập, JWT | 8 | Statement, Branch, Exception |
| [BookingServiceTest](file:///home/ngcuong/Data/TraveWithMe/backend/src/test/java/com/example/travel/booking/service/BookingServiceTest.java) | Đặt chỗ, Hủy chỗ, State Machine | 12 | Branch, Path, State Transition |
| [TourServiceTest](file:///home/ngcuong/Data/TraveWithMe/backend/src/test/java/com/example/travel/catalog/service/TourServiceTest.java) | Tìm kiếm, CRUD Tour | 10 | Branch, Exception |
| [ReviewServiceTest](file:///home/ngcuong/Data/TraveWithMe/backend/src/test/java/com/example/travel/review/service/ReviewServiceTest.java) | Đánh giá dịch vụ | 8 | Statement, Error Handling |
| [PaymentServiceTest](file:///home/ngcuong/Data/TraveWithMe/backend/src/test/java/com/example/travel/payment/service/PaymentServiceTest.java) | Thanh toán VietQR, Idempotency | 9 | Branch, Logic Flow |

---

## 3. KỸ THUẬT ÁP DỤNG

### 3.1 Statement Coverage (Độ phủ câu lệnh)
Đảm bảo mỗi câu lệnh trong phương thức được thực thi ít nhất một lần.
- *Ví dụ:* Trong `AuthService.register()`, thực hiện test case đăng ký thành công để đi qua toàn bộ các bước lưu vào DB và sinh Token.

### 3.2 Branch Coverage (Độ phủ nhánh)
Kiểm tra tất cả các nhánh rẽ của câu lệnh điều kiện.
- *Ví dụ:* Trong `BookingService.createBooking()`, sử dụng kỹ thuật kiểm thử nhánh để phủ các trường hợp `HOTEL`, `FLIGHT`, `TOUR`, và `POI` trong khối `switch-case`.

### 3.3 Exception Testing (Kiểm thử ngoại lệ)
Sử dụng `assertThrows` để kiểm tra khả năng bắt lỗi và trả về đúng mã lỗi của hệ thống.
- *Ví dụ:* Kiểm tra lỗi `OUT_OF_STOCK` khi đặt phòng khách sạn nếu số lượng phòng trống bằng 0.

### 3.4 Mocking với Mockito
Sử dụng Mockito để cô lập logic của Service, không phụ thuộc vào Database thật:
- Mock Repositories (`userRepository`, `bookingRepository`)
- Mock Utilities (`jwtUtil`, `passwordEncoder`)

## 4. CÁC ĐƯỜNG DẪN TỚI HẠN (CRITICAL PATHS)

Dưới đây là các phương thức quan trọng nhất được tập trung kiểm thử:

- **AuthService.register():** Phủ 3 đường dẫn (Thành công, Email trùng, Password biên 6 ký tự).
- **BookingService.createBooking():** Phủ logic tính tiền cho Hotel (nights * price), Flight và Tour. Kiểm tra các điều kiện dừng sớm (INVALID_DATES, OUT_OF_STOCK).
- **PaymentService.processPaymentSuccess():** Kiểm tra tính **Idempotency** (đảm bảo một giao dịch không được xử lý hai lần).

---

## 5. KẾT QUẢ CHẠY TEST

Kết quả thực thi lệnh `./mvnw test`:

```text
[INFO] Results:
[INFO] Tests run: 47, Failures: 0, Errors: 0, Skipped: 0
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
```

**Kết luận:** 100% test cases đã đạt (Pass), đảm bảo logic nghiệp vụ backend hoạt động ổn định và tin cậy.
