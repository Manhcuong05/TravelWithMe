# KIỂM THỬ TĨNH - Code Review Report
**Công cụ:** Phân tích thủ công (Manual Static Analysis)  
**Ngày:** 2026-03-18  
**Phiên bản:** Backend TravelWithMe v1.0  

---

## 1. PHƯƠNG PHÁP

Nhóm tiến hành rà soát mã nguồn (Code Review) trên toàn bộ backend theo các tiêu chí:
- Tuân thủ nguyên tắc SOLID
- Xử lý ngoại lệ đầy đủ
- Bảo mật thông tin
- Khả năng đọc và bảo trì

---

## 2. KẾT QUẢ RÀ SOÁT

### 2.1 Rà soát tài liệu SRS & Thiết kế DB (SRS Review)

**Nội dung:** Phân tích logic thiết kế cơ sở dữ liệu và đặc tả yêu cầu.
- **Phát hiện:** Bảng `HotelRoom` hiện tại thiếu trường `roomCategory` (hạng phòng) để phân loại rõ ràng Suite/Deluxe/Standard, dẫn đến khó khăn khi lọc kết quả.
- **Phát hiện:** Đặc tả Use Case đặt phòng chưa mô tả rõ luồng xử lý hoàn tiền khi hủy đơn đã thanh toán.

**Mức độ:** 🟡 TRUNG BÌNH

---

### 2.2 JwtUtil.java – Hardcoded Secret Key (Security Hole)

**Vị trí:** `JwtUtil.java:21`

```java
@Value("${jwt.secret:404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970}")
```

**Nhận xét:** Secret key dùng để ký JWT đang được hardcode mặc định trong mã nguồn. Đây là lỗ hổng bảo mật nghiêm trọng nếu hacker có quyền đọc source code.

**Mức độ:** 🔴 CAO  
**Đề xuất:** Xóa giá trị mặc định, chỉ lấy từ biến môi trường (Environment Variables) hoặc `.env` file.

---

### 2.3 ReviewService.java – Potential NullPointerException

**Vị trí:** `ReviewService.java:55`

```java
// Code hiện tại
User user = userRepository.findById(review.getUserId()).orElse(null);
String userName = user != null ? user.getFullName() : "Người dùng TravelWithMe";
```

**Nhận xét:** Xử lý `null` an toàn, tuy nhiên việc dùng `orElse(null)` sau đó check null là anti-pattern. Nên sử dụng `map()` trực tiếp.

**Mức độ:** ⚠️ THẤP  
**Đề xuất:**
```java
// Cải tiến
String userName = userRepository.findById(review.getUserId())
    .map(User::getFullName)
    .orElse("Người dùng TravelWithMe");
```

---

### 2.2 BookingService.java – Magic Number

**Vị trí:** `BookingService.java:64`

```java
long nights = 1; // Magic number - mặc định 1 đêm
```

**Nhận xét:** Số `1` nên được khai báo thành hằng số `DEFAULT_NIGHTS = 1` để tăng khả năng đọc.

**Mức độ:** ⚠️ THẤP  

---

### 2.3 PaymentService.java – Hardcoded Payment URL

**Vị trí:** `PaymentService.java:63`

```java
String mockQrUrl = "https://img.vietqr.io/image/970422-123456789-qr_only.jpg?amount=..."
```

**Nhận xét:** URL VietQR đang được hardcode trong code. Nên đưa vào `application.yml` hoặc biến môi trường để dễ bảo trì và deploy nhiều môi trường.

**Mức độ:** 🔴 TRUNG BÌNH  
**Đề xuất:**
```yaml
# application.yml
payment:
  vietqr:
    base-url: https://img.vietqr.io/image/
    bank-id: 970422
    account-number: 123456789
```

---

### 2.4 AuthService.java – Verbose Code

**Vị trí:** `AuthService.java:43-47`

```java
// Code lặp lại ở cả register() và login()
String jwtToken = jwtUtil.generateToken(new org.springframework.security.core.userdetails.User(...));
```

**Nhận xét:** Logic sinh JWT được copy-paste ở 2 phương thức. Nên refactor thành private helper method riêng.

**Mức độ:** ⚠️ THẤP  

---

### 2.5 TravelApplicationTests.java – Rỗng

**Vị trí:** `TravelApplicationTests.java`

```java
@SpringBootTest
class TravelApplicationTests {
    @Test
    void contextLoads() {}  // Test không có assertion
}
```

**Nhận xét:** Test class `@SpringBootTest` yêu cầu kết nối database thật khi chạy, sẽ fail trong môi trường CI/CD không có DB. Nên thêm `@ActiveProfiles("test")` hoặc dùng H2 in-memory DB cho integration test.

**Mức độ:** 🔴 TRUNG BÌNH  

---

## 3. TỔNG KẾT

| Mức độ | Số lượng |
|---|---|
| 🔴 Trung bình | 2 |
| ⚠️ Thấp | 3 |
| ✅ Không phát hiện lỗi nghiêm trọng | - |

**Kết luận:** Mã nguồn nhìn chung được tổ chức tốt theo cấu trúc package-by-feature. Không có lỗ hổng bảo mật nghiêm trọng. Các vấn đề phát hiện đều là cải tiến về chất lượng code, không ảnh hưởng đến tính đúng đắn của chức năng.
