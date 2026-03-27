---
description: Cách khởi chạy backend an toàn (giải phóng port 8080)
---

Để khởi chạy backend mà không gặp lỗi "Port 8080 was already in use", hãy thực hiện các bước sau:

1. Giải phóng port 8080 (nếu có):
// turbo
```bash
lsof -t -i:8080 | xargs kill -9 || true
```

2. Khởi chạy Backend:
```bash
cd backend && mvn spring-boot:run
```

3. (Tùy chọn) Chạy tests:
```bash
cd backend && mvn test
```

4. Sau khi kết thúc hoặc gặp lỗi, hãy chạy lại bước 1 để đảm bảo port được giải phóng hoàn toàn.
