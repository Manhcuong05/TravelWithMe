# 🌍 TravelWithMe - Personalized Travel Suggestion & Booking System

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Angular](https://img.shields.io/badge/Angular-21-red.svg)](https://angular.io/)
[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**TravelWithMe** is a premium, all-in-one travel platform designed to provide personalized travel suggestions and a seamless booking experience. From finding luxury tours to booking flights and hotels, the system integrates advanced AI planning with a robust booking engine.

---

## ✨ Key Features

### 🔐 Identity & Security
- **Secure Authentication:** JWT-based login and registration.
- **Social Login:** Integrated with Google OAuth2 for a frictionless experience.
- **Role-based Access Control:** Distinct permissions for Customers and Administrators.

### 🏨 Booking & Catalog
- **Multi-Service Catalog:** Extensive listings for Tours, Hotels, and Flights.
- **Advanced Search:** Filter by location, price, rating, and availability.
- **Dynamic Booking Engine:** Real-time availability checks and instant confirmations.

### 💳 Payments & Notifications
- **VNPay Integration:** Secure payment gateway for domestic and international cards.
- **Voucher System:** Apply promotional codes to get discounts on bookings.
- **Automatic Status Sync:** Real-time updates on booking states (Confirmed, Cancelled, Completed).

### 🤖 AI-Powered Itinerary
- **AI Itinerary Planner:** Personalized trip planning based on user preferences and historical data.

---

## 🛠 Technology Stack

### Backend (Spring Boot)
- **Framework:** Spring Boot 3.2.5 (Java 17)
- **Security:** Spring Security & OAuth2 (JWT)
- **Database:** PostgreSQL with Spring Data JPA
- **Mapping:** MapStruct for efficient DTO-Entity conversion
- **Utilities:** Lombok, Dotenv-Java, Hibernate Validator
- **Testing:** JUnit 5, Mockito, JaCoCo

### Frontend (Angular)
- **Framework:** Angular 18/19+ (TypeScript)
- **Styling:** Premium Vanilla CSS / Modern UI components
- **Testing:** Vitest, JSDom
- **Formatting:** Prettier, ESLint

---

## 📂 Project Structure

```text
TravelWithMe/
├── backend/                # Spring Boot Application
│   ├── src/main/java       # Source code (Controllers, Services, Repos)
│   ├── src/test/java       # Unit & Integration Tests
│   └── pom.xml             # Maven dependencies
├── frontend/               # Angular Workspace
│   ├── src/app             # Components, Modules, Services
│   └── package.json        # Frontend dependencies
├── api_documentation.md    # API Reference & Endpoints
├── travel_with_me.postman_collection.json # API Testing Collection
└── seed_data.sql           # Initial Database setup script
```

---

## 🚀 Getting Started

### Prerequisites
- JDK 17 or higher
- Node.js & npm (latest LTS recommended)
- PostgreSQL
- Maven

### 1. Database Setup
1. Create a database named `travel_with_me`.
2. Execute the `seed_data.sql` script to initialize dummy data.

### 2. Backend Configuration
1. Navigate to `backend/`.
2. Create a `.env` file or update `src/main/resources/application.yml` with your credentials:
   ```env
   DB_URL=jdbc:postgresql://localhost:5432/travel_with_me
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   JWT_SECRET=your_jwt_secret
   ```
3. Run the application:
   ```bash
   mvn spring-boot:run
   ```

### 3. Frontend Setup
1. Navigate to `frontend/`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
   The app will be available at `http://localhost:4200`.

---

## 🧪 Quality & Testing
We prioritize system stability through multiple testing layers:
- **Unit Testing:** Comprehensive logic verification for Services.
- **White-box Testing:** Focused on Statement and Branch coverage using JaCoCo.
- **Manual QA:** Detailed bug tracking via GitHub Issues and Jira.
- **Performance:** Load testing using Apache JMeter.

---

## 🤝 Contributors
Developed with ❤️ by **Nhóm SOFT2 - BIT23**
- [Nguyễn Mạnh Cường](https://github.com/Manhcuong05)
- [Nguyễn Hoàng Duy]
- [Vũ Minh Hiển]
- [Bùi Xuân Quân]
- [Chu Văn Sơn]

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
