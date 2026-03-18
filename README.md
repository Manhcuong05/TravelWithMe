# 🧪 Dự án Kiểm thử Hệ thống TravelWithMe

Chào mừng bạn đến với kho lưu trữ chính thức của bộ kiểm thử toàn diện cho hệ thống **TravelWithMe**. Repository này đã được tinh chỉnh để tập trung hoàn toàn vào các tài liệu báo cáo, kịch bản kiểm thử và mã nguồn Unit Test, đáp ứng đầy đủ các yêu cầu chuyên sâu về kiểm thử phần mềm.

---

## 📂 Cấu trúc Dự án Kiểm thử

Dự án được tổ chức gọn gàng để dễ dàng tra cứu và đối chiếu:

```text
TravelWithMe/
├── testing/                    # 📄 Tòa bộ báo cáo và kịch bản (Phần A - G)
│   ├── 01_BlackBox_Testing/    # Test cases Hộp đen (EP, BVA, Decision Table)
│   ├── 02_WhiteBox_Testing/    # Báo cáo kỹ thuật Hộp trắng
│   ├── 03_Static_Testing/      # Rà soát mã nguồn (Code Review & SRS)
│   ├── 04_NonFunctional_Testing/# Kịch bản kiểm thử hiệu năng (JMeter)
│   ├── 06_Bug_Management/      # Nhật ký quản lý lỗi (Bug Log)
│   ├── 07_Quality_Metrics/     # Chỉ số độ phủ (JaCoCo)
│   └── 08_Manual_vs_Automation/# Phân tích chiến lược kiểm thử
├── backend/src/test/java/...   # 💻 Mã nguồn 47 Unit Tests (JUnit 5 + Mockito)
└── README.md                   # 📘 Tài liệu hướng dẫn này
```

---

## 📘 Khớp Nội dung với Yêu cầu (Đề bài)

Dưới đây là bảng đối chiếu giữa các mục trong kho lưu trữ này với các yêu cầu thực tế:

| Yêu cầu đề bài | Vị trí tài liệu / Mã nguồn | Kỹ thuật & Giải trình |
|:--- |:--- |:--- |
| **Phần A: Black Box** | [`testing/01_BlackBox_Testing/`](file:///home/ngcuong/Data/TraveWithMe/testing/01_BlackBox_Testing/test_cases.md) | Áp dụng EP (Phân vùng tương đương), BVA (Giá trị biên), Decision Table và Use Case cho 5 tính năng cốt lõi. |
| **Phần B: White Box** | [`backend/src/test/java/...`](file:///home/ngcuong/Data/TraveWithMe/backend/src/test/java/com/example/travel/) | 47 Unit Tests sử dụng **JUnit 5 & Mockito**. Tập trung phủ các đường dẫn tới hạn (Critical Paths) và xử lý ngoại lệ. |
| **Phần C: Metrics** | [`testing/07_Quality_Metrics/`](file:///home/ngcuong/Data/TraveWithMe/testing/07_Quality_Metrics/quality_report.md) | Sử dụng **JaCoCo** để đo Instruction/Branch Coverage. Các Service chính đạt độ phủ >80%. |
| **Phần D: Non-Functional**| [`testing/04_NonFunctional_Testing/`](file:///home/ngcuong/Data/TraveWithMe/testing/04_NonFunctional_Testing/performance_test_plan.md) | Xây dựng kịch bản **Apache JMeter** giả lập 50 người dùng đồng thời để kiểm tra độ trễ (Avg Latency). |
| **Phần E: Static** | [`testing/03_Static_Testing/`](file:///home/ngcuong/Data/TraveWithMe/testing/03_Static_Testing/code_review_report.md) | Rà soát lỗi bảo mật (Hardcoded JWT Secret) và thiết kế DB (thiếu trường phân loại phòng). |
| **Phần F: Bug Log** | [`testing/06_Bug_Management/`](file:///home/ngcuong/Data/TraveWithMe/testing/06_Bug_Management/bug_log.md) | Theo dõi 8 lỗi thực tế phát hiện được qua kiểm thử, phân loại theo mức độ nghiêm trọng. |
| **Phần G: Strategy** | [`testing/08_Manual_vs_Automation/`](file:///home/ngcuong/Data/TraveWithMe/testing/08_Manual_vs_Automation/strategy.md) | Giải trình chiến lược kết hợp (Hybrid): Manual cho UX/UI và Automation cho Regression/Core Logic. |

---

## � Giải trình & Giải thích Kiểm thử (Test Rationale)

### 1. Tại sao chọn JUnit 5 & Mockito?
- **JUnit 5:** Là framework chuẩn nhất cho Java, cung cấp các Assertion mạnh mẽ (như `assertThrows`).
- **Mockito:** Cho phép "cô lập" logic của Service. Chúng ta không cần database thật hay server đang chạy, giúp tốc độ thực thi test cực nhanh (47 tests trong < 10 giây).

### 2. Kỹ thuật Hộp trắng (White-box)
Chúng tôi tập trung vào **Branch Coverage** và **Exception Coverage**. Điều này đảm bảo rằng không chỉ các luồng "Happy Path" (thành công) được test, mà cả các trường hợp dữ liệu sai, lỗi hệ thống cũng được xử lý an toàn, tránh treo ứng dụng.

### 3. Chỉ số JaCoCo
Chúng tôi chọn JaCoCo vì nó tích hợp sâu vào Maven Build. Kết quả trực quan với các màu xanh/đỏ giúp lập trình viên biết ngay dòng code nào đang "nguy hiểm" vì chưa được kiểm thử.

---

## 🚀 Hướng dẫn Chạy Kiểm thử

Để tái hiện lại các kết quả trong báo cáo, bạn cần có Java 17+ và thực hiện:

1. **Chạy toàn bộ Unit Test:**
   ```bash
   mvn test
   ```

2. **Sinh báo cáo độ phủ (HTML):**
   ```bash
   mvn jacoco:report
   ```
   Sau đó mở tệp: `backend/target/site/jacoco/index.html`

---

*Hệ thống kiểm thử được thực hiện bởi Nhóm SOFT2 - BIT23*  
*Người thực hiện: Nguyễn Mạnh Cường và đồng đội.*
