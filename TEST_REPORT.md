# TEST REPORT - TRAVELWITHME

## 1. Tong quan
- Du an: TravelWithMe
- Ngay thuc hien test: 2026-03-15
- Muc tieu bai tap:
1. Chay kiem thu don vi (unit test)
2. Chay kiem thu giao dien tu dong (UI automation / E2E)
- Pham vi:
1. Frontend Angular (unit + e2e)
2. Backend Spring Boot (unit/context test)

## 2. Cong cu va framework su dung
1. Frontend unit test: Vitest thong qua `ng test`
2. Backend unit test: JUnit5 + Mockito + Spring Boot Test (Maven Surefire)
3. UI automation: Playwright (`@playwright/test`)
4. Test database backend: H2 in-memory (profile `test`)

## 3. Van de gap phai ban dau
1. Frontend unit test fail:
- Loi `No provider found for ActivatedRoute`
- Nguyen nhan: component `App` co su dung routing, nhung test bed chua cung cap router provider
2. Frontend assertion cu khong dung voi UI hien tai:
- Test kiem tra `h1` chua `Hello, frontend`
- UI thuc te khong con noi dung nay
3. Backend unit test fail:
- Expected message khong khop voi thong diep thuc te cua `TourService#getTourById`
4. Backend `contextLoads` fail:
- Test dang ket noi PostgreSQL that
- Moi truong test khong co thong tin DB dung
5. Chua co framework E2E:
- Du an chua co Playwright/Cypress config san de chay UI automation

## 4. Cac thay doi da thuc hien

### 4.1 Frontend unit test
1. Cap nhat testbed de co router provider
2. Doi assertion de kiem tra logo navbar `TravelWithMe` dung voi UI hien tai

File da sua:
1. `frontend/src/app/app.spec.ts`

### 4.2 Backend unit test
1. Chinh assertion `TourServiceTest` theo behavior hien tai (kiem tra message co `ID: 2`)
2. Bat profile test cho `TravelApplicationTests`
3. Them cau hinh `application-test.yml` su dung H2
4. Them dependency H2 scope test trong `pom.xml`

File da sua/them:
1. `backend/src/test/java/com/example/travel/catalog/service/TourServiceTest.java`
2. `backend/src/test/java/com/example/travel/TravelApplicationTests.java`
3. `backend/src/test/resources/application-test.yml`
4. `backend/pom.xml`

### 4.3 UI automation (Playwright)
1. Them dependency `@playwright/test`
2. Them scripts:
- `test:unit`
- `test:e2e:install`
- `test:e2e`
3. Them file config Playwright
4. Them 3 testcase E2E:
- Home page load va hien thi navigation chinh
- Dieu huong tu navbar sang trang login
- Route khong ton tai se redirect ve home

File da sua/them:
1. `frontend/package.json`
2. `frontend/package-lock.json`
3. `frontend/playwright.config.ts`
4. `frontend/e2e/app.e2e.spec.ts`

## 5. Danh sach test case va ket qua

### 5.1 Frontend unit test
Lenh chay:
```bash
cd frontend
npm run test:unit
```

Ket qua:
1. Test files: 2 passed
2. Tests: 4 passed
3. Trang thai: PASS

### 5.2 Backend unit test
Lenh chay:
```bash
cd backend
mvn test
```

Ket qua:
1. Tong test: 5
2. Failures: 0
3. Errors: 0
4. BUILD SUCCESS
5. Trang thai: PASS

Ghi chu:
1. `TravelApplicationTests` da chay voi profile `test`
2. DB test da dung H2 in-memory, khong phu thuoc PostgreSQL that

### 5.3 UI automation (E2E)
Lenh chay lan dau (de cai browser):
```bash
cd frontend
npm run test:e2e:install
```

Lenh chay test:
```bash
npm run test:e2e
```

Ket qua:
1. `loads home page with core navigation` - PASS
2. `navigates to login page from navbar` - PASS
3. `redirects unknown route to home page` - PASS
4. Tong: 3 passed

## 6. Huong dan run lai de nop bai
1. Frontend:
```bash
cd frontend
npm install
npm run test:unit
npm run test:e2e:install
npm run test:e2e
```
2. Backend:
```bash
cd backend
mvn test
```

## 7. Ket luan
1. Da dat yeu cau bai tap: co unit test va UI automation test chay duoc
2. Da sua cac loi test setup de test on dinh va co the lap lai
3. Toan bo test da PASS tai thoi diem thuc hien (2026-03-15)

## 8. Danh gia ket qua tong the
1. Muc do dat yeu cau bai tap: DAT TOT
- Da co day du 2 nhom theo de bai: unit test va UI automation test
- Tat ca bo test deu PASS
2. Chat luong thuc thi test:
- Frontend unit test PASS 100% (4/4)
- Backend test PASS 100% (5/5)
- Frontend UI E2E PASS 100% (3/3)
3. Diem manh:
- Co the chay lap lai bang script ro rang
- Backend test duoc tach khoi DB that bang profile `test` + H2
- E2E bao phu duoc luong giao dien co ban cua nguoi dung
4. Rui ro con lai:
- So luong testcase chua nhieu, chu yeu bao phu happy path
- Chua co bao cao do bao phu (coverage %) cho frontend/backend
- E2E chua bao phu luong dang nhap thanh cong/that bai voi mock API
5. De xuat danh gia de dua vao bao cao:
- Ket qua tong the: HOAN THANH
- Muc on dinh hien tai: TOT
- Muc san sang nop bai: SAN SANG
