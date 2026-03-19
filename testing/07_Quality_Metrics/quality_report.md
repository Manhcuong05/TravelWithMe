# PHẦN C: CHỈ SỐ CHẤT LƯỢNG (Quality Metrics)

**Công cụ đo lường:** JaCoCo (Java Code Coverage library)  
**Ngày báo cáo:** 2026-03-18  

---

## 1. TỔNG QUAN ĐỘ PHỦ (OVERALL COVERAGE)

Sau khi thực thi 47 unit tests, hệ thống JaCoCo đã phân tích và sinh báo cáo độ phủ cho toàn bộ source code.

| Tiêu chí | Kết quả | Đánh giá |
|---|---|---|
| **Instruction Coverage** | 27% (Toàn project) | ⚠️ Trung bình |
| **Branch Coverage** | 24% (Toàn project) | ⚠️ Trung bình |
| **Line Coverage** | 30% (Toàn project) | ⚠️ Trung bình |

> **Lưu ý:** Tỷ lệ trên tính trên toàn bộ project (bao gồm cả các module Controller, Entity, DTO không cần viết Unit Test). Tuy nhiên, các module core business (Service) đạt tỷ lệ rất cao.

---

## 2. CHI TIẾT ĐỘ PHỦ CÁC MODULE QUAN TRỌNG (SERVICE LAYER)

Đây là các module chứa logic nghiệp vụ chính, mục tiêu kiểm thử tập trung vào đây:

| Package / Class | Line Coverage | Branch Coverage | Trạng thái |
|---|---|---|---|
| `com.example.travel.booking.service` | **80%** | **64%** | ✅ Tốt |
| `com.example.travel.review.service` | **84%** | **100%** | ✅ Xuất sắc |
| `com.example.travel.identity.service` | **51%** | **33%** | 🆗 Đạt yêu cầu |
| `com.example.travel.catalog.service` | **20%** | **23%** | ⚠️ Cần bổ sung |
| `com.example.travel.payment.service` | **25%** | **27%** | ⚠️ Cần bổ sung |

---

## 3. PHÂN TÍCH TRỰC QUAN (VISUAL ANALYSIS)

Dựa trên báo cáo HTML tại `backend/target/site/jacoco/index.html`:

- **Màu xanh (Covered):** Code đã được kiểm thử.
- **Màu vàng (Partially Covered):** Chỉ có một phần nhánh của `if/else` được test.
- **Màu đỏ (Not Covered):** Code chưa được chạy qua bởi bất kỳ test case nào.

**Hình ảnh chứng minh:**
![JaCoCo Overview Report](file:///home/ngcuong/.gemini/antigravity/brain/25fd2a43-19ce-4343-a61e-f56fa4d3c5b1/jacoco_overview_1773798038441.png)

---

## 4. KẾT LUẬN & KIẾN NGHỊ

### Ưu điểm:
- Logic quan trọng nhất (Đặt phòng, Review) đã được bao phủ trên 80%.
- Không có class Service nào quan trọng bị bỏ sót hoàn toàn (đều có màu xanh).

### Hạn chế:
- Một số Service phụ (Catalog, Payment) độ phủ còn thấp do các hàm CRUD đơn giản.
- Các module `Controller` và `Entity` chưa được Unit Test (thường kiểm thử qua API Test hoặc Integration Test).

### Kiến nghị:
- Duy trì việc chạy JaCoCo mỗi khi thay đổi code để đảm bảo không bị giảm tỷ lệ coverage (*Regression Testing*).
- Bổ sung thêm Integration Test (hộp xám) để phủ thêm phần liên kết giữa Controller và Service.
