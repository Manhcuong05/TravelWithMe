# CÂU D: QUẢN LÝ LỖI PHẦN MỀM (DEFECT MANAGEMENT)

Để đạt được hiệu quả quản lý lỗi toàn diện, nhóm đã triển khai song song hai công cụ nhằm mục đích đối sánh quy trình:
- **GitHub Issues** (Cấp độ cơ bản/Dự án mã nguồn mở): [GitHub Issues](https://github.com/Manhcuong05/TravelWithMe/issues)
- **Jira Software** (Cấp độ doanh nghiệp/Quản trị Agile): [Jira Board](https://travelwith.atlassian.net/jira/software/projects/KAN/boards/1)

Dưới đây là chi tiết quy trình quản lý lỗi thực tiễn được áp dụng cho dự án TravelWithMe:

---

## I. Quản lý lỗi bằng GitHub Issues

### 1. Thiết lập biểu mẫu báo cáo (Bug Report Template)
Nhằm chuẩn hóa dữ liệu đầu vào, QA Lead đã cấu hình mẫu báo cáo tại `.github/ISSUE_TEMPLATE/bug_report.md`. Mỗi Tester khi ghi nhận lỗi bắt buộc phải cung cấp đủ 6 trường thông tin: **Summary, Environment, Steps to Reproduce, Expected Result, Actual Result, và Severity.** Điều này giúp Developer tái hiện (reproduce) và khắc phục lỗi nhanh chóng.

### 2. Danh sách lỗi ghi nhận (Bug Log)
Thông qua Kiểm thử thủ công (Manual Testing), nhóm đã ghi nhận 5 lỗi, được gán nhãn (label) và phân loại theo Mức độ nghiêm trọng (Severity):
- **[High] Bug 1:** Lỗi không thể đăng nhập bằng tài khoản Google (OAuth2). Form đăng nhập báo "Client ID không hợp lệ", cản trở hoàn toàn luồng người dùng.
- **[Medium] Bug 2:** Form tìm kiếm tour thiếu xác thực (validation) ngày khởi hành. Hệ thống vẫn truy xuất dữ liệu khi chọn ngày trong quá khứ.
- **[Medium] Bug 3:** Hệ thống trả về lỗi HTTP 400 ra giao diện Frontend khi áp dụng mã Voucher không đủ điều kiện, thiếu thông báo lỗi thân thiện với người dùng (User-friendly message).
- **[Low] Bug 4:** Lỗi hiển thị giao diện thẻ Tour khi quy đổi tiền tệ sang USD do chuỗi số thập phân quá dài.
- **[Minor] Bug 5:** AI Planner gợi ý lịch trình thiếu tham số thời gian di chuyển dự kiến giữa các địa điểm.

### 3. Vòng đời xử lý lỗi (Bug Life Cycle)
Chu trình xử lý thực tế được vận hành (ví dụ với Bug 1 - Lỗi OAuth2):
- **Open/Assigned:** Tester tạo Issue và chỉ định (Assign) cho Developer phụ trách.
- **In Progress/Fixed:** Developer tiếp nhận, kiểm tra, cập nhật lại biến môi trường `.env` và xác nhận hoàn thành.
- **Retest/Closed:** Tester kiểm tra lại tính năng, xác nhận kết quả (Pass) và đóng thẻ lỗi.

---

## II. Quản lý lỗi bằng Jira (Mô phỏng quy trình doanh nghiệp)

### 1. Thiết lập Workflow và Ghi nhận 8 Lỗi
Với quy mô quản trị nâng cao, nhóm thiết lập bảng Jira Software theo Workflow chuẩn mực: **New > Open > In Progress > Fixed > QA Verify > Done.** Các lỗi được ghi nhận và đánh giá theo Mức độ ưu tiên (Priority):
- **[KAN-4]** Lỗi hệ thống Server (HTTP 500) khi xác nhận thanh toán qua VNPay. (Priority: Blocker/Highest)
- **[KAN-5]** Trạng thái Booking không tự động cập nhật khi khách hàng hủy tour. (Priority: Highest)
- **[KAN-6]** Admin không thể thay đổi trạng thái mã khuyến mãi từ "Active" sang "Inactive". (Priority: High)
- **[KAN-7]** Hệ thống không gửi Email thông báo đặt tour thành công. (Priority: High)
- **[KAN-8]** Bản đồ vị trí điểm đến không tải được do lỗi API Key. (Priority: Medium)
- **[KAN-9]** Chức năng lọc đánh giá theo số sao không hoạt động. (Priority: Medium)
- **[KAN-10]** Sai lỗi chính tả tại nút "Thanh toán ngay". (Priority: Low)
- **[KAN-11]** Avatar bị biến dạng tỷ lệ khi tải lên. (Priority: Low)

### 2. Phân tích nguyên nhân gốc rễ (Root Cause Analysis - RCA)

**Critical Bug 1: Lỗi Server khi thanh toán VNPay (Mã KAN-4)**
- **Nguyên nhân:** Thuật toán băm mã (Hash) xác thực checksum ném ngoại lệ `NullPointerException` do thiếu biến môi trường `VNP_HASH_SECRET` khi triển khai (deploy).
- **Hệ quả:** Mức độ Blocker. Dẫn đến rủi ro thất thoát tài chính, trải nghiệm xấu và tăng tải hệ thống CSKH.

**Critical Bug 2: Bất đồng bộ dữ liệu giao dịch Hủy vé (Mã KAN-5)**
- **Nguyên nhân:** Webhook từ Payment Service phản hồi chậm dẫn đến Timeout. Hệ thống thiếu cơ chế Retry hoặc Message Broker để xử lý các tác vụ bất đồng bộ.
- **Hệ quả:** Mức độ Highest. Gây sai lệch trạng thái tài nguyên, lãng phí ghế/phòng và thất thoát doanh thu tiềm năng.

---

## III. Giám sát và Báo cáo (Metrics & Reporting)
- **Họp phân loại lỗi (Triage Meeting):** Nhóm (Tester, Dev, PM) họp ngắn (15 phút/ngày) để rà soát lỗi trên Jira, xác nhận, điều chỉnh Priority.
- **Báo cáo trạng thái (Bug by Status & Priority):** Theo dõi tiến độ để phát hiện điểm nghẽn (bottleneck). Đảm bảo tiêu chí: 100% lỗi Blocker/Highest phải được xử lý trước khi Release.
