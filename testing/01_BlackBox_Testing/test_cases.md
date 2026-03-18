# PHẦN A: KIỂM THỬ HỘP ĐEN (Black Box Testing)

**Dự án:** TravelWithMe  
**Người thực hiện:** Nguyễn Mạnh Cường, Nguyễn Hoàng Duy, Vũ Minh Hiển, Bùi Xuân Quân, Chu Văn Sơn  
**Ngày thực hiện:** 2026-03-18

---

## 1. ĐẶT VẤN ĐỀ – TẠI SAO CHỌN KỸ THUẬT NÀY?

Kiểm thử hộp đen (Black Box Testing) chú trọng vào **đầu vào → đầu ra** mà không cần biết logic bên trong. Nhóm áp dụng 4 kỹ thuật chính:

| Tính năng kiểm thử | Kỹ thuật áp dụng | Lý do lựa chọn |
|---|---|---|
| Đăng ký tài khoản | **EP + BVA** | Có ràng buộc rõ ràng: email format, password ≥ 6 ký tự |
| Đăng nhập | **Decision Table** | Nhiều điều kiện kết hợp: email tồn tại × mật khẩu đúng/sai |
| Tìm kiếm Tour | **Use Case Testing** | Luồng người dùng rõ ràng, có các bước cụ thể |
| Đặt phòng / Tour | **State Transition** | Booking có nhiều trạng thái: AWAITING_PAYMENT → CONFIRMED → CANCELLED |
| Hủy đặt chỗ | **State Transition + BVA** | Logic hủy phụ thuộc vào trạng thái hiện tại |

---

## 2. KẾT QUẢ KIỂM THỬ

### 2.1 Tính năng: Đăng ký tài khoản
**Kỹ thuật:** Phân vùng tương đương (EP) + Phân tích giá trị biên (BVA)

**Phân vùng tương đương:**

| Lớp tương đương | Điều kiện | Ví dụ | Kỳ vọng |
|---|---|---|---|
| EP1 - Email hợp lệ | Đúng định dạng email | `user@travel.com` | Chấp nhận |
| EP2 - Email không hợp lệ | Sai định dạng | `usertravel`, `user@` | Từ chối |
| EP3 - Password hợp lệ | ≥ 6 ký tự | `abc123` | Chấp nhận |
| EP4 - Password biên dưới | 5 ký tự | `abc12` | Từ chối |
| EP5 - Email trùng | Email đã tồn tại trong DB | `existed@travel.com` | Từ chối, msg: "Email đã tồn tại" |

**Test Cases:**

| TC# | Mô tả | Dữ liệu đầu vào | Kết quả mong đợi | Pass/Fail |
|---|---|---|---|---|
| TC-BB-01 | Đăng ký thành công | email: `new@travel.com`, pw: `travel123`, name: `Nguyễn A` | HTTP 200, trả về JWT token | ✅ Pass |
| TC-BB-02 | Email không đúng định dạng | email: `invalidmail`, pw: `123456` | HTTP 400, msg: "Email không đúng định dạng" | ✅ Pass |
| TC-BB-03 | Mật khẩu đúng biên (6 ký tự) | email: `a@b.com`, pw: `123456` | HTTP 200, đăng ký thành công | ✅ Pass |
| TC-BB-04 | Mật khẩu dưới biên (5 ký tự) | email: `a@b.com`, pw: `12345` | HTTP 400, msg: "Mật khẩu phải có ít nhất 6 ký tự" | ✅ Pass |
| TC-BB-05 | Email trùng | email: `existed@travel.com`, pw: `123456` | HTTP 400, code: `EMAIL_ALREADY_EXISTS` | ✅ Pass |
| TC-BB-06 | Email rỗng | email: `""`, pw: `123456` | HTTP 400, msg: "Email không được để trống" | ✅ Pass |
| TC-BB-07 | Tên người dùng rỗng | email: `a@b.com`, pw: `123456`, name: `""` | HTTP 400, validation error | ✅ Pass |

---

### 2.2 Tính năng: Đăng nhập
**Kỹ thuật:** Bảng quyết định (Decision Table)

**Điều kiện:**
- C1: Email tồn tại trong hệ thống? (Có/Không)
- C2: Mật khẩu đúng? (Đúng/Sai)

**Bảng quyết định:**

| | R1 | R2 | R3 |
|---|---|---|---|
| C1: Email tồn tại | Có | Có | Không |
| C2: Mật khẩu đúng | Đúng | Sai | - |
| **Kết quả** | **Đăng nhập thành công** ✅ | **Sai thông tin** ❌ | **Sai thông tin** ❌ |

**Test Cases:**

| TC# | Mô tả | C1 | C2 | Kết quả mong đợi | Pass/Fail |
|---|---|---|---|---|---|
| TC-BB-10 | Đăng nhập thành công | Có | Đúng | HTTP 200, JWT token | ✅ Pass |
| TC-BB-11 | Sai mật khẩu | Có | Sai | HTTP 401, Unauthorized | ✅ Pass |
| TC-BB-12 | Email không tồn tại | Không | - | HTTP 401, Unauthorized | ✅ Pass |
| TC-BB-13 | Email và password rỗng | Không | Sai | HTTP 400, validation | ✅ Pass |

---

### 2.3 Tính năng: Tìm kiếm Tour
**Kỹ thuật:** Use Case Testing

**Ca sử dụng UC-01: Tìm kiếm Tour theo địa điểm**

- **Tác nhân:** Khách du lịch (đã hoặc chưa đăng nhập)
- **Tiền điều kiện:** Hệ thống có dữ liệu tour
- **Luồng chính:**
  1. Người dùng nhập địa điểm vào ô tìm kiếm
  2. Hệ thống gọi API `GET /api/catalog/tours?location={location}`
  3. Hệ thống trả về danh sách tour phù hợp
  4. Người dùng xem danh sách kết quả

**Test Cases:**

| TC# | Mô tả | Input | Kết quả mong đợi | Pass/Fail |
|---|---|---|---|---|
| TC-BB-20 | Tìm kiếm có kết quả | location: `"Hà Nội"` | Danh sách tour Hà Nội | ✅ Pass |
| TC-BB-21 | Tìm kiếm không có kết quả | location: `"Sao Hỏa"` | Danh sách rỗng `[]` | ✅ Pass |
| TC-BB-22 | Không nhập địa điểm | location: `""` | Tất cả tour trong hệ thống | ✅ Pass |
| TC-BB-23 | Lấy chi tiết tour theo ID | id: `"tour-001"` | Thông tin đầy đủ của tour | ✅ Pass |
| TC-BB-24 | Tour không tồn tại | id: `"nonexistent-id"` | HTTP 404, tour not found | ✅ Pass |
| TC-BB-25 | Tìm kiếm Chuyến bay | from: `"Hà Nội"`, to: `"Đà Nẵng"` | Danh sách các chuyến bay phù hợp | ✅ Pass |
| TC-BB-26 | Lọc Tour theo giá | min: `1tr`, max: `2tr` | Các tour trong khoảng giá 1-2tr | ✅ Pass |

---

### 2.4 Tính năng: Đặt phòng / vé máy bay (Booking)
**Kỹ thuật:** State Transition Testing

**Sơ đồ chuyển trạng thái Booking:**

```
[Tạo đơn] → AWAITING_PAYMENT
                    │
          Thanh toán VietQR
                    │
              CONFIRMED ──── Hủy → CANCELLED
                    │
             Hoàn thành
                    │
               COMPLETED
```

**Test Cases - State Transition:**

| TC# | Trạng thái hiện tại | Sự kiện | Trạng thái tiếp theo | Pass/Fail |
|---|---|---|---|---|
| TC-BB-30 | Không có | Tạo đơn hàng | AWAITING_PAYMENT | ✅ Pass |
| TC-BB-31 | AWAITING_PAYMENT | Thanh toán thành công | CONFIRMED | ✅ Pass |
| TC-BB-32 | AWAITING_PAYMENT | Hủy đơn | CANCELLED | ✅ Pass |
| TC-BB-33 | CONFIRMED | Hủy đơn | CANCELLED | ✅ Pass |
| TC-BB-34 | CANCELLED | Hủy đơn lại | Lỗi: INVALID_STATUS | ✅ Pass |

---

### 2.5 Tính năng: Đặt phòng khách sạn
**Kỹ thuật:** BVA cho trường ngày checkin/checkout

| TC# | Mô tả | Check-in | Check-out | Kết quả mong đợi | Pass/Fail |
|---|---|---|---|---|---|
| TC-BB-40 | Đặt 1 đêm (biên dưới) | 2025-07-01 | 2025-07-02 | Thành công, 1 đêm | ✅ Pass |
| TC-BB-41 | Ngày checkout = checkin | 2025-07-01 | 2025-07-01 | Lỗi: INVALID_DATES | ✅ Pass |
| TC-BB-42 | Ngày checkout < checkin | 2025-07-05 | 2025-07-01 | Lỗi: INVALID_DATES | ✅ Pass |
| TC-BB-43 | Đặt phòng khi hết phòng | 2025-07-01 | 2025-07-03 | Lỗi: OUT_OF_STOCK | ✅ Pass |

---

## 3. TỔNG KẾT

| Tính năng | Tổng TC | Pass | Fail |
|---|---|---|---|
| Đăng ký | 7 | 7 | 0 |
| Đăng nhập | 4 | 4 | 0 |
| Tìm kiếm Tour | 5 | 5 | 0 |
| State Transition Booking | 5 | 5 | 0 |
| BVA Đặt phòng khách sạn | 4 | 4 | 0 |
| **Tổng cộng** | **25** | **25** | **0** |
