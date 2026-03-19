# CHIẾN LƯỢC KẾT HỢP KIỂM THỬ THỦ CÔNG VÀ TỰ ĐỘNG

**Dự án:** TravelWithMe  
**Ngày:** 2026-03-18  

---

## 1. PHÂN TÍCH SO SÁNH

| Tiêu chí | Kiểm thử thủ công | Kiểm thử tự động |
|---|---|---|
| **Chi phí ban đầu** | Thấp | Cao (viết script) |
| **Chi phí lặp lại** | Cao (mỗi lần test) | Rất thấp |
| **Tốc độ** | Chậm | Nhanh (ms/test) |
| **Độ tin cậy** | Dễ bỏ sót | Nhất quán |
| **Phù hợp với** | UI/UX, Exploratory Testing | Regression, Unit Test |
| **Khả năng phát hiện bug mới** | Cao | Thấp (chỉ test đã viết) |

---

## 2. CHIẾN LƯỢC ÁP DỤNG CHO TRAVELWITHME

### Kiểm thử thủ công (Manual Testing):
Áp dụng cho các trường hợp:
- ✋ **Exploratory Testing:** Khám phá tính năng mới, phát hiện bug không dự kiến
- ✋ **UI/UX Testing:** Kiểm tra giao diện người dùng (Angular frontend)
- ✋ **End-to-end flow:** Trải nghiệm full flow: đăng ký → tìm tour → đặt chỗ → thanh toán
- ✋ **Payment Testing:** Kiểm tra QR code VietQR thực tế

### Kiểm thử tự động (Automation Testing):
Áp dụng cho:
- 🤖 **Unit Tests (JUnit + Mockito):** Tất cả service classes (AuthService, BookingService, v.v.)
- 🤖 **Regression Testing:** Chạy tự động khi có thay đổi code mới
- 🤖 **Performance Testing:** JMeter test plan chạy định kỳ
- 🤖 **API Testing:** Postman Collection chạy tự động với Newman

---

## 2.5 TIÊU CHÍ LỰA CHỌN TÍNH NĂNG TỰ ĐỘNG HÓA

Dựa trên nguyên tắc tối ưu hóa chi phí và thời gian, nhóm lựa chọn Unit Test tự động cho:
1. **Tính năng cốt lõi:** Đặt chỗ, Thanh toán, Đăng nhập.
2. **Tính năng ổn định:** Các chức năng ít thay đổi giao diện nhưng logic phức tạp.
3. **Tính năng lặp lại:** Các API cần kiểm tra hồi quy (Regression) mỗi khi có commit mới.

---

## 3. PHÂN BỔ THỜI GIAN KIỂM THỬ

```
┌─────────────────────────────────────┐
│          Testing Pyramid            │
│                                     │
│           ┌─────┐                   │
│           │ E2E │  10%              │
│          ┌┴─────┴┐                  │
│          │  API  │  30%             │
│         ┌┴───────┴┐                 │
│         │  Unit   │  60%            │
│         └─────────┘                 │
└─────────────────────────────────────┘
```

| Loại | Công cụ | Tỷ lệ | Chạy khi nào |
|---|---|---|---|
| Unit Test | JUnit 5 + Mockito | 60% | Mỗi commit |
| API Test | Postman + Newman | 30% | Mỗi deploy |
| E2E Test | Thủ công / JMeter | 10% | Trước release |

---

## 4. WORKFLOW KIỂM THỬ

```
Developer commit code
        │
        ▼
[1] Unit Tests (JUnit + Mockito) ─── FAIL ──► Fix code
        │ PASS
        ▼
[2] Build & Package (Maven)
        │
        ▼
[3] API Tests (Postman) ─── FAIL ──► Fix API
        │ PASS
        ▼
[4] Manual Smoke Test (UI) ─── FAIL ──► Report Bug
        │ PASS
        ▼
[5] Ready for Release ✅
```

---

## 5. KẾT LUẬN

Kết hợp kiểm thử thủ công và tự động giúp:
- **Tăng tốc độ:** Unit tests chạy trong < 30 giây
- **Tăng độ tin cậy:** Tự động phát hiện regression bugs
- **Giảm chi phí:** Không cần test lại thủ công mỗi khi có thay đổi nhỏ
- **Tăng chất lượng:** Manual testing tập trung vào UX và edge cases mới

Nhóm áp dụng theo mô hình **"Shift Left Testing"** – kiểm thử ngay từ sớm trong quá trình phát triển thay vì chỉ test cuối sprint.
