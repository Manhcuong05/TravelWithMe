<div align="center">
  <img src="frontend/public/images/home_hero.png" alt="TravelWithMe Banner" width="100%">
  
  <br />
  <br />

  # ✈️ TravelWithMe (Pro Max Edition)
  
  **Nền tảng Quản lý & Lên kế hoạch Du lịch Thông minh chuẩn Luxury**
  
  [![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.5-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
  [![Angular](https://img.shields.io/badge/Angular-17+-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
  [![Gemini AI](https://img.shields.io/badge/Gemini_AI-Pro-1A73E8?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)

  [Tính Năng](#-tính-năng-nổi-bật) •
  [Kiến Trúc Hệ Thống](#-kiến-trúc-hệ-thống) •
  [Cài Đặt Lên Môi Trường](#-hướng-dẫn-cài-đặt-local) •
  [Tài Liệu API](#-tài-liệu--api)

</div>

---

## 🌟 Giới Thiệu
**TravelWithMe** là một hệ sinh thái đặt tour và thiết kế hành trình du lịch cao cấp. Không chỉ dừng lại ở việc đặt chỗ, hệ thống được tích hợp trí tuệ nhân tạo (Gemini AI) để đưa ra các gợi ý lịch trình cá nhân hóa dựa trên sở thích và ngân sách của người dùng. Giao diện được thiết kế độc quyền theo phong cách **Luxury Dark Mode**, mang lại trải nghiệm mượt mà, sang trọng và chuyên nghiệp.

## 🔥 Tính Năng Nổi Bật

### 1. Dành Cho Khách Hàng (Traveler)
* **🤖 Trợ Lý AI (AI Itinerary Planner):** Tự động tạo lịch trình du lịch cá nhân hóa (gợi ý địa điểm, phân bổ thời gian, dự trù kinh phí) dựa trên dữ liệu đầu vào.
* **🏨 Đặt Phiếu Dịch Vụ Mượt Mà:** Hỗ trợ đặt Tour, Khách sạn, Chuyến bay với giỏ hàng và thanh toán một chạm qua cơ chế mock **VietQR**.
* **✉️ Tự Động Hóa Thông Báo (SMTP):** Gửi Email tức thời xác nhận đơn hàng, gửi mã OTP bảo mật 2 lớp, nhắc nhở khách hàng đánh giá sau khi hoàn tất chuyến đi.
* **💬 Hỗ Trợ Trực Tuyến 24/7:** Tích hợp WebSocket Chat Real-time ngay trên giao diện web giúp liên lạc trực tiếp với Admin.
* **🔑 OAuth2 & SSO:** Hỗ trợ đăng nhập nhanh bằng Google (Google One Tap) và JWT Authentication.

### 2. Dành Cho Quản Trị Viên (Admin & Collaborator)
* **📊 Dashboard Tinh Gọn:** Quản lý số liệu doanh thu, tỷ lệ lấp đầy, thông kê tài chính theo thời gian thực.
* **🧑‍💻 Phân Quyền Vai Trò (RBAC):** Cấp quyền chi tiết (Admin > CTV > Guest), chỉ hiển thị các cấu hình hệ thống (Settings/Uploads) cho người được ủy quyền.
* **📨 Trung Tâm Chăm Sóc Khách Hàng:** Giao diện điều phối tin nhắn Chat thời gian thực giúp Admin chat với hàng nghìn khách hàng đồng thời mà không bị trễ.
* **⚙️ Dynamic Content Management:** Cho phép thay đổi ảnh đại diện Đội ngũ chuyên gia (Expert Team), Banner, Thông tin cấu hình hệ thống trực tiếp xuống cơ sở dữ liệu.

---

## 🏗 Kiến Trúc Hệ Thống

```mermaid
graph TD;
    Client[Angular 17 Client] -->|HTTPS REST| AG[Spring Boot API Gateway];
    Client -->|WebSocket/STOMP| Chat[Real-time Chat Module];
    
    subgraph Backend Core (Java 17/21)
        AG --> Auth[Authentication & Security Filter];
        AG --> AI[Gemini AI Service];
        AG --> Booking[Booking & Payment Engine];
        AG --> Mail[JavaMail SMTP Worker];
    end

    Auth --> DB[(PostgreSQL)];
    AI --> DB;
    Booking --> DB;
    Mail --> DB;
```

### Tech Stack Chi Tiết
- **Frontend:** Angular 17 (Standalone Components), Angular Signals, RxJS, Ngx-Socket-JS, Tailwind CSS, Lenis Smooth Scroll.
- **Backend:** Spring Boot 3.2.5, Spring Security 6 (JWT Filter), Spring Data JPA, Hibernate, JavaMailSender.
- **Database:** PostgreSQL.
- **External Integration:** Gemini Pro API (Tạo lịch trình AI), Google OAuth2.

---

## 🚀 Hướng Dẫn Cài Đặt (Local)

### Yêu Cầu Môi Trường
- Node.js `v18+`, Angular CLI `v17+`
- Java `JDK 17` hoặc `JDK 21`
- Maven `3.8+`
- PostgreSQL `14+`

### 1. Cấu Hình Backend (Spring Boot)
1. Di chuyển vào thư mục backend:
   ```bash
   cd backend
   ```
2. Tạo file `.env` tại thư mục gốc backend và cung cấp các key sau:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=travel_db
   DB_USERNAME=postgres
   DB_PASSWORD=123456
   SERVER_PORT=8080

   # Security
   JWT_SECRET=your_super_secret_jwt_key_here_must_be_very_long
   JWT_EXPIRATION=86400000

   # External APIs
   GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
   GEMINI_API_KEY=your_gemini_api_key

   # SMTP Email Configuration
   MAIL_USERNAME=your_email@gmail.com
   MAIL_PASSWORD=your_google_app_password
   ```
3. Cài đặt CSDL (Tạo User postgres và database `travel_db`), sau đó chạy Backend:
   ```bash
   mvn spring-boot:run
   ```

### 2. Cài Đặt Frontend (Angular)
1. Mở một Terminal mới và di chuyển vào frontend:
   ```bash
   cd frontend
   ```
2. Cài đặt các gói phụ thuộc:
   ```bash
   npm install
   ```
3. Khởi động Webpack Server:
   ```bash
   npm start
   ```
4. Truy cập hệ thống tại: `http://localhost:4200`

---

## 🔐 Phân Quyền Tài Khoản (Seeder Data)
Để phục vụ việc test nhanh, hệ thống sẽ tự động gieo mầm (Seed) dữ liệu vào DB trong lần khởi chạy đầu tiên.

| Chức vụ | Tên đăng nhập | Mật khẩu | Quyền hạn |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@travel.com` | `admin123` | Toàn quyền thao tác trên toàn bộ module và Settings. |
| **Cộng Tác Viên (CTV)** | `ctv@travel.com` | `ctv123` | Quản lý đánh giá, nội dung content, upload hình ảnh nhưng không thể xóa User. |
| **Người Dùng (Traveler)**| Đăng ký mới | `Người dùng tự tạo` | Book vé, lên kế hoạch AI, thanh toán hóa đơn. |

---

<p align="center">
  <b>Được phát triển với niềm đam mê dành cho sự hoàn hảo & kiến trúc phần mềm cao cấp.</b><br>
  <code>TravelWithMe © 2026 - All rights reserved.</code>
</p>
