# Project Rules: TravelWithMe

## 1. Backend Operation Rule
- **CRITICAL**: Перед запуском backend (`mvn spring-boot:run`) или тестов, всегда проверяйте и очищайте порт 8080.
- **Lệnh thực thi**: `lsof -t -i:8080 | xargs kill -9 || true`
- **Mục đích**: Tránh lỗi "Web server failed to start. Port 8080 was already in use" khi tiến trình cũ không tự đóng.

## 2. AI Implementation Patterns
- **Hallucination Prevention**: AI gợi ý (ItineraryService) phải được lọc qua `filterRecommendations` trong mã nguồn Java để đảm bảo 100% ID tồn tại trong DB.
- **REST Status**: Luôn trả về 404 cho tài nguyên không tìm thấy thay vì 400 hoặc 500.
