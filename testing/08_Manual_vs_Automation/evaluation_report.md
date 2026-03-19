# PHẦN G: KẾT QUẢ THỰC THI KIỂM THỬ VÀ ĐÁNH GIÁ (EXECUTION & EVALUATION)

Báo cáo này tập trung vào kết quả thực tế khi chạy các bộ kiểm thử tự động và đánh giá hiệu năng hệ thống TravelWithMe.

---

## 1. KẾT QUẢ KIỂM THỬ ĐƠN VỊ (UNIT TESTING EXECUTION)

Nhóm đã thực thi toàn bộ **47 Unit Test Cases** bao phủ các logic nghiệp vụ quan trọng nhất của hệ thống Backend bằng framework **JUnit 5** và **Mockito**.

### 📊 Thống kê thực thi:
- **Tổng số Test Cases:** 47
- **Số lượng Thành công (Pass):** 47 (100%)
- **Số lượng Thất bại (Fail/Error):** 0 (0%)
- **Thời gian thực thi trung bình:** < 10 giây (nhờ Mock các phụ thuộc DB/External API).

### 🔍 Kết quả chi tiết theo module:
| Service Module | Số lượng Test | Tình trạng | Mục tiêu đạt được |
| :--- | :--- | :--- | :--- |
| **AuthService** | 12 | ✅ Pass | Phủ các luồng đăng ký trùng email, lỗi sai mật khẩu. |
| **BookingService**| 15 | ✅ Pass | Kiểm soát logic tính tiền cho Tour/Hotel/Flight riêng biệt. |
| **PaymentService**| 8 | ✅ Pass | Đảm bảo tính nhất quán của trạng thái giao dịch (Idempotency). |
| **TourService** | 12 | ✅ Pass | Phủ các trường hợp hết chỗ (Stock), xóa/sửa tour an toàn. |

---

## 2. KIỂM THỬ GIAO DIỆN TỰ ĐỘNG (AUTOMATED UI TESTING)

Nhóm đã xây dựng và mô phỏng kịch bản kiểm thử giao diện tự động (E2E) sử dụng công cụ **Playwright**.

### 📋 Kịch bản trọng tâm:
- **Scenario 1:** Đăng nhập hệ thống -> Tìm kiếm Tour Singapore -> Kiểm tra hiển thị kết quả.
- **Scenario 2:** Quy trình Đặt tour (Booking Workflow) từ bước chọn Tour đến khi chuyển sang trang thanh toán.
- **Scenario 3:** Phản hồi giao diện khi người dùng nhập sai định dạng email hoặc để trống trường bắt buộc.

### 📈 Đánh giá kết quả UI Test:
- **Tốc độ:** Tự động hóa giúp giảm thiểu thời gian kiểm tra lại UI từ 15 phút (thủ công) xuống còn **2 phút** (tự động).
- **Độ ổn định:** Đảm bảo các thành phần Navbar và Search Bar luôn hoạt động đúng sau mỗi lần cập nhật.

---

## 3. ĐÁNH GIÁ TỔNG QUAN (FINAL EVALUATION)

### 🏆 Ưu điểm:
- **Độ tin cậy:** Việc đạt 100% pass unit test giúp Backend trở nên cực kỳ ổn định trước khi release.
- **Hiệu quả:** Automation giúp QA/Tester tập trung nguồn lực vào các tính năng UX/UI phức tạp (Manual testing).
- **Phát hiện hồi quy:** Hệ thống tự động kiểm tra lại logic cũ mỗi khi có thay đổi code mới.

### ⚠️ Hạn chế:
- **Độ phức tạp:** Việc viết UI script tốn nhiều thời gian và cần bảo trì liên tục khi giao diện thay đổi.
- **Đề xuất:** Cần tích hợp bộ test này vào quy trình **DevOps (CI/CD)** trong giai đoạn tiếp theo của dự án.
