-- ============================================================================
-- HƯỚNG DẪN SỬ DỤNG (READ ME FIRST):
-- 1. Đảm bảo bạn đã khởi chạy ứng dụng Backend ít nhất một lần để Hibernate tự động 
--    tạo bảng trong database 'travel_db'.
-- 2. Trong DBeaver, hãy đảm bảo bạn đang chọn Database là 'travel_db' (Chuột phải vào 
--    database 'travel_db' -> Set as default / Chọn trong thanh công cụ).
-- 3. File này sẽ XÓA dữ liệu cũ trước khi chèn dữ liệu mới.
-- ============================================================================

-- 1. XÓA DỮ LIỆU CŨ (Nếu có)
-- Lưu ý: Nếu bảng chưa tồn tại, các lệnh DELETE này có thể báo lỗi. 
-- Bạn có thể bôi đen và chạy từng phần INSERT bên dưới nếu muốn.

-- Xóa các check constraint cũ nếu chúng đang ngăn cản việc chèn dữ liệu mới (do enum thay đổi)
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_service_type_check;
ALTER TABLE booking_items DROP CONSTRAINT IF EXISTS booking_items_service_type_check;

TRUNCATE TABLE reviews CASCADE;
TRUNCATE TABLE tours CASCADE;
TRUNCATE TABLE pois CASCADE;
TRUNCATE TABLE flights CASCADE;
TRUNCATE TABLE hotel_rooms CASCADE;
TRUNCATE TABLE hotels CASCADE;
TRUNCATE TABLE users CASCADE;

-- 2. CHÈN DỮ LIỆU NGƯỜI DÙNG (USERS)
-- Mật khẩu mặc định: 'password123'
INSERT INTO users (id, email, password, full_name, phone, role, preferences_json, created_at, updated_at) VALUES
('u001', 'admin@travel.com', '$2a$10$pXtc/R9UExF6vXJ.y2UqI.B9F.f.e5qY.n6lP6O6I.m6h6p6u6S6y', 'Hệ Thống Admin', '0901234567', 'ADMIN', '{"interest": ["all"]}', NOW(), NOW()),
('u002', 'ctv1@travel.com', '$2a$10$pXtc/R9UExF6vXJ.y2UqI.B9F.f.e5qY.n6lP6O6I.m6h6p6u6S6y', 'Nguyễn Văn Cộng Tác', '0912345678', 'CTV', '{"interest": ["tour", "hotel"]}', NOW(), NOW()),
('u003', 'traveler1@gmail.com', '$2a$10$pXtc/R9UExF6vXJ.y2UqI.B9F.f.e5qY.n6lP6O6I.m6h6p6u6S6y', 'Trần Thị Du Lịch', '0923456789', 'TRAVELER', '{"interest": ["beach", "luxury"]}', NOW(), NOW()),
('u004', 'traveler2@gmail.com', '$2a$10$pXtc/R9UExF6vXJ.y2UqI.B9F.f.e5qY.n6lP6O6I.m6h6p6u6S6y', 'Lê Văn Khám Phá', '0934567890', 'TRAVELER', '{"interest": ["mountain", "hiking"]}', NOW(), NOW()),
('u005', 'traveler3@gmail.com', '$2a$10$pXtc/R9UExF6vXJ.y2UqI.B9F.f.e5qY.n6lP6O6I.m6h6p6u6S6y', 'Phạm Minh Phượt', '0945678901', 'TRAVELER', '{"interest": ["historical", "culture"]}', NOW(), NOW()),
('u006', 'traveler4@gmail.com', '$2a$10$pXtc/R9UExF6vXJ.y2UqI.B9F.f.e5qY.n6lP6O6I.m6h6p6u6S6y', 'Hoàng An Nhiên', '0956789012', 'TRAVELER', '{"interest": ["resort", "spa"]}', NOW(), NOW()),
('u007', 'traveler5@gmail.com', '$2a$10$pXtc/R9UExF6vXJ.y2UqI.B9F.f.e5qY.n6lP6O6I.m6h6p6u6S6y', 'Đặng Thế Vinh', '0967890123', 'TRAVELER', '{"interest": ["adventure"]}', NOW(), NOW()),
('u008', 'traveler6@gmail.com', '$2a$10$pXtc/R9UExF6vXJ.y2UqI.B9F.f.e5qY.n6lP6O6I.m6h6p6u6S6y', 'Bùi Xuân Huấn', '0978901234', 'TRAVELER', '{"interest": ["city", "shopping"]}', NOW(), NOW()),
('u009', 'traveler7@gmail.com', '$2a$10$pXtc/R9UExF6vXJ.y2UqI.B9F.f.e5qY.n6lP6O6I.m6h6p6u6S6y', 'Ngô Kiến Huy', '0989012345', 'TRAVELER', '{"interest": ["food", "street_art"]}', NOW(), NOW()),
('u010', 'traveler8@gmail.com', '$2a$10$pXtc/R9UExF6vXJ.y2UqI.B9F.f.e5qY.n6lP6O6I.m6h6p6u6S6y', 'Sơn Tùng MTP', '0990123456', 'TRAVELER', '{"interest": ["music", "concert"]}', NOW(), NOW());

-- 3. CHÈN DỮ LIỆU KHÁCH SẠN (HOTELS)
INSERT INTO hotels (id, name, description, address, city, country, rating, star_rating, images_json, created_at, updated_at) VALUES
('h001', 'InterContinental Danang Sun Peninsula Resort', 'Khu nghỉ dưỡng sang trọng bậc nhất thế giới.', 'Bãi Bắc, Sơn Trà', 'Đà Nẵng', 'Việt Nam', 4.9, 5, '["https://images.unsplash.com/photo-1566073771259-6a8506099945"]', NOW(), NOW()),
('h002', 'Sofitel Legend Metropole Hanoi', 'Khách sạn lịch sử phong cách Pháp cổ điển.', '15 Ngô Quyền', 'Hà Nội', 'Việt Nam', 4.8, 5, '["https://images.unsplash.com/photo-1551882547-ff43c63be3db"]', NOW(), NOW()),
('h003', 'JW Marriott Phu Quoc Emerald Bay Resort', 'Kỳ quan kiến trúc tinh tế tại Bãi Kem.', 'Bãi Kem, An Thới', 'Phú Quốc', 'Việt Nam', 4.7, 5, '["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb"]', NOW(), NOW()),
('h004', 'Park Hyatt Saigon', 'Đẳng cấp sang trọng giữa lòng thành phố.', '2 Công trường Lam Sơn', 'TP. Hồ Chí Minh', 'Việt Nam', 4.8, 5, '["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4"]', NOW(), NOW()),
('h005', 'Six Senses Ninh Van Bay', 'Biệt thự riêng biệt hòa mình cùng thiên nhiên.', 'Vịnh Ninh Vân', 'Nha Trang', 'Việt Nam', 4.9, 5, '["https://images.unsplash.com/photo-1445019980597-93fa8acb246c"]', NOW(), NOW()),
('h006', 'Four Seasons Resort The Nam Hai', 'Lối kiến trúc tuyệt mỹ bên bờ biển Hà My.', 'Điện Dương, Điện Bàn', 'Hội An', 'Việt Nam', 4.7, 5, '["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b"]', NOW(), NOW()),
('h007', 'Amanoi Resort', 'Nơi bình yên tuyệt đối giữa núi rừng Ninh Thuận.', 'Vĩnh Hy, Ninh Hải', 'Ninh Thuận', 'Việt Nam', 5.0, 5, '["https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9"]', NOW(), NOW()),
('h008', 'Movenpick Resort Waverly Phu Quoc', 'Nét hiện đại Thụy Sĩ bên đảo ngọc.', 'Bãi Ông Lang', 'Phú Quốc', 'Việt Nam', 4.5, 5, '["https://images.unsplash.com/photo-1564501049412-61c2a3083791"]', NOW(), NOW()),
('h009', 'Vinpearl Resort & Spa Ha Long', 'Lâu đài giữa vịnh kỳ quan.', 'Đảo Rêu', 'Hạ Long', 'Việt Nam', 4.6, 5, '["https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e"]', NOW(), NOW()),
('h010', 'Hotel de la Coupole - MGallery', 'Kiệt tác nghệ thuật giữa biển mây Sapa.', '1 Đường Hoàng Liên', 'Sapa', 'Việt Nam', 4.7, 5, '["https://images.unsplash.com/photo-1541973369761-1249fa6b2fc1"]', NOW(), NOW());

-- 4. CHÈN DỮ LIỆU PHÒNG (HOTEL ROOMS)
INSERT INTO hotel_rooms (id, hotel_id, room_type, price_per_night, capacity, total_rooms, amenities_json) VALUES
('r001', 'h001', 'Classic Terrace Ocean View', 12000000, 2, 20, '["Ocean View", "Mini Bar", "Wifi", "Balcony"]'),
('r002', 'h001', 'Son Tra Villa', 45000000, 2, 5, '["Private Pool", "Butler", "Elite Access"]'),
('r003', 'h002', 'Luxury Room', 7500000, 2, 50, '["Classic Decor", "Coffee Maker", "Bathtub"]'),
('r004', 'h003', 'Emerald Bay View', 8500000, 2, 30, '["Bay View", "Garden", "Modern System"]'),
('r005', 'h004', 'Park Suite', 15000000, 2, 10, '["City View", "Luxury Linens", "24h Service"]'),
('r006', 'h005', 'Hill Top Pool Villa', 22000000, 2, 8, '["Private Pool", "Wine Cellar", "Sea View"]'),
('r007', 'h006', 'One Bedroom Villa', 18000000, 2, 15, '["Outdoor Shower", "Garden View"]'),
('r008', 'h007', 'Mountain Pavilion', 35000000, 2, 6, '["Zen Design", "Mountain View", "Private Terrace"]'),
('r009', 'h008', 'Superior Sea View', 4500000, 3, 100, '["Balcony", "Fridge", "Modern Decor"]'),
('r010', 'h010', 'Deluxe King', 5500000, 2, 40, '["French Design", "Cloud View", "Heater"]');

-- 5. CHÈN DỮ LIỆU CHUYẾN BAY (FLIGHTS)
INSERT INTO flights (id, flight_number, airline, departure_city, arrival_city, departure_airport, arrival_airport, departure_time, arrival_time, base_price, aircraft) VALUES
('f001', 'VN123', 'Vietnam Airlines', 'Hà Nội', 'Đà Nẵng', 'HAN', 'DAD', '2026-04-01 08:00:00', '2026-04-01 09:15:00', 1500000, 'Airbus A350'),
('f002', 'VJ456', 'Vietjet Air', 'TP. Hồ Chí Minh', 'Phú Quốc', 'SGN', 'PQC', '2026-04-02 10:30:00', '2026-04-02 11:30:00', 800000, 'Airbus A321'),
('f003', 'QH789', 'Bamboo Airways', 'Đà Nẵng', 'Hà Nội', 'DAD', 'HAN', '2026-04-05 20:00:00', '2026-04-05 21:15:00', 1200000, 'Boeing 787'),
('f004', 'VN246', 'Vietnam Airlines', 'TP. Hồ Chí Minh', 'Hà Nội', 'SGN', 'HAN', '2026-04-10 14:00:00', '2026-04-10 16:15:00', 2500000, 'Boeing 787'),
('f005', 'VJ135', 'Vietjet Air', 'Hải Phòng', 'Nha Trang', 'HPH', 'CXR', '2026-04-12 07:00:00', '2026-04-12 08:45:00', 1100000, 'Airbus A320'),
('f006', 'QH258', 'Bamboo Airways', 'Hà Nội', 'Quy Nhơn', 'HAN', 'UIH', '2026-04-15 09:45:00', '2026-04-15 11:15:00', 1300000, 'Airbus A320neo'),
('f007', 'VN369', 'Vietnam Airlines', 'Cần Thơ', 'Đà Lạt', 'VCA', 'DLI', '2026-04-20 16:30:00', '2026-04-20 17:15:00', 950000, 'ATR 72'),
('f008', 'VJ741', 'Vietjet Air', 'Vinh', 'TP. Hồ Chí Minh', 'VII', 'SGN', '2026-04-22 19:20:00', '2026-04-22 21:05:00', 1250000, 'Airbus A321'),
('f009', 'VN852', 'Vietnam Airlines', 'Bangkok', 'TP. Hồ Chí Minh', 'BKK', 'SGN', '2026-05-01 13:00:00', '2026-05-01 14:30:00', 3500000, 'Airbus A321'),
('f010', 'QH963', 'Bamboo Airways', 'Hà Nội', 'Singapore', 'HAN', 'SIN', '2026-05-05 10:00:00', '2026-05-05 13:30:00', 4200000, 'Airbus A321LR');

-- 6. CHÈN DỮ LIỆU ĐỊA ĐIỂM (POIS)
INSERT INTO pois (id, name, description, category, address, city, latitude, longitude, images_json, average_spend) VALUES
('p001', 'Bàn Tay Vàng - Ba Na Hills', 'Cây cầu biểu tượng với hai bàn tay khổng lồ.', 'Historical', 'Hòa Ninh, Hòa Vang', 'Đà Nẵng', 15.998, 107.996, '["https://images.unsplash.com/photo-1559592413-7ce75d0e34c9"]', 900000),
('p002', 'Vịnh Hạ Long', 'Kỳ quan thiên nhiên thế giới với hàng nghìn đảo đá vôi.', 'Nature', 'Vịnh Bắc Bộ', 'Hạ Long', 20.910, 107.183, '["https://images.unsplash.com/photo-1528127269322-539801943592"]', 2000000),
('p003', 'Phố Cổ Hội An', 'Đô thị cổ được bảo tồn nguyên vẹn.', 'Historical', 'Minh An', 'Hội An', 15.880, 108.338, '["https://images.unsplash.com/photo-1616487853625-e55541604996"]', 500000),
('p004', 'Dinh Độc Lập', 'Chứng nhân lịch sử của TP. Hồ Chí Minh.', 'Historical', '135 Nam Kỳ Khởi Nghĩa', 'TP. Hồ Chí Minh', 10.776, 106.695, '["https://images.unsplash.com/photo-1559592413-7ce75d0e34c9"]', 100000),
('p005', 'Hồ Hoàn Kiếm', 'Trái tim của thủ đô Hà Nội.', 'Historical', 'Hoàn Kiếm', 'Hà Nội', 21.028, 105.852, '["https://images.unsplash.com/photo-1502134249126-9f3755a50d78"]', 50000),
('p006', 'Chùa Linh Ứng - Bán Đảo Sơn Trà', 'Tượng Phật Bà Quan Âm cao nhất Việt Nam.', 'Religious', 'Thọ Quang, Sơn Trà', 'Đà Nẵng', 16.100, 108.277, '["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb"]', 0),
('p007', 'Mũi Né', 'Đồi cát bay và những bãi biển đẹp.', 'Nature', 'Phan Thiết', 'Bình Thuận', 10.933, 108.287, '["https://images.unsplash.com/photo-1559592413-7ce75d0e34c9"]', 300000),
('p008', 'Thác Datanla', 'Trải nghiệm máng trượt xuyên rừng thông.', 'Adventure', 'Phường 3', 'Đà Lạt', 11.912, 108.448, '["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4"]', 150000),
('p009', 'Nhà Thờ Đức Bà', 'Biểu tượng kiến trúc Công giáo tại Sài Gòn.', 'Religious', '01 Công xã Paris', 'TP. Hồ Chí Minh', 10.779, 106.699, '["https://images.unsplash.com/photo-1564501049412-61c2a3083791"]', 0),
('p010', 'Thung Lũng Tình Yêu', 'Điểm đến lãng mạn tại thành phố sương mù.', 'Park', 'Đường Mai Anh Đào', 'Đà Lạt', 11.977, 108.450, '["https://images.unsplash.com/photo-1541973369761-1249fa6b2fc1"]', 200000);

-- 7. CHÈN DỮ LIỆU TOUR (TOURS)
INSERT INTO tours (id, title, description, location, price, duration_days, highlights, itinerary_json, images_json, hotel_id, flight_id, poi_ids, ai_suggestions, created_at) VALUES
('t001', 'Kỳ Nghỉ Thượng Lưu Đà Nẵng', 'Trải nghiệm resort 5 sao và khám phá Ba Na Hills.', 'Đà Nẵng', 25000000, 4, 'Resort 5 sao,Ba Na Hills,Bay khứ hồi,Buffet hải sản', '["Day 1: Arrival and Check-in", "Day 2: Ba Na Hills Golden Bridge", "Day 3: Son Tra Peninsula", "Day 4: Relax and Departure"]', '["https://images.unsplash.com/photo-1559592413-7ce75d0e34c9"]', 'h001', 'f001', 'p001,p006', 'Nên mang theo giày đi bộ thoải mái để tham quan Ba Na Hills.', NOW()),
('t002', 'Khám Phá Đảo Ngọc Phú Quốc', 'Tận hưởng bãi biển xanh ngắt và lặn ngắm san hô.', 'Phú Quốc', 18000000, 3, 'Lặn ngắm san hô,VinWonders,Bãi Kem,Sunset Sanato', '["Day 1: Welcome to PQ", "Day 2: Undersea adventures", "Day 3: Local delicacies"]', '["https://images.unsplash.com/photo-1533105079780-92b9be482077"]', 'h003', 'f002', 'p007', 'Chuẩn bị kem chống nắng và đồ bơi.', NOW()),
('t003', 'Hành Trình Di Sản Miền Trung', 'Huế - Đà Nẵng - Hội An trong 5 ngày.', 'Miền Trung', 15000000, 5, 'Phố cổ Hội An,Đại Nội Huế,Cầu Vàng,Ngũ Hành Sơn', '["Day 1: Hue Imperial", "Day 2: Lang Co Beach", "Day 3: Da Nang City", "Day 4: Hoi An lantern and art", "Day 5: My Son Sanctuary"]', '["https://images.unsplash.com/photo-1528127269322-539801943592"]', 'h006', 'f003', 'p003,p001', 'Thử món cao lầu tại Hội An nhé.', NOW()),
('t004', 'Sài Gòn - Hòn Ngọc Viễn Đông', 'Tham quan các điểm đến lịch sử và ẩm thực đường phố.', 'TP. Hồ Chí Minh', 8000000, 2, 'Dinh Độc Lập,Nhà thờ Đức Bà,Bitexco,Phố Tây Bùi Viện', '["Day 1: History Tour", "Day 2: Street Food Safari"]', '["https://images.unsplash.com/photo-1551882547-ff43c63be3db"]', 'h004', 'f004', 'p004,p009', 'Sử dụng Grab để di chuyển thuận tiện trong thành phố.', NOW()),
('t005', 'Hà Nội - Nghìn Năm Văn Hiến', 'Dạo quanh 36 phố phường và tận hưởng tiết trời mùa thu.', 'Hà Nội', 9000000, 3, 'Hồ Hoàn Kiếm,Lăng Bác,Văn Miếu,36 Phố Phường', '["Day 1: Capital Heart", "Day 2: Old Quarter exploration", "Day 3: West Lake relax"]', '["https://images.unsplash.com/photo-1502134249126-9f3755a50d78"]', 'h002', 'f003', 'p005', 'Nên ăn phở Thìn Lò Đúc vào buổi sáng.', NOW()),
('t006', 'Nghỉ Dưỡng Vịnh Ninh Vân', 'Trải nghiệm biệt thự biển biệt lập và đẳng cấp.', 'Nha Trang', 40000000, 3, 'Villa riêng biệt,Tắm biển,Spa,Tiệc tối lãng mạn', '["Day 1: Secluded arrival", "Day 2: Private Bay Activities", "Day 3: Luxury Spa Day"]', '["https://images.unsplash.com/photo-1445019980597-93fa8acb246c"]', 'h005', 'f005', 'p007', 'Thích hợp cho các cặp đôi hưởng tuần trăng mật.', NOW()),
('t007', 'Đà Lạt - Thành Phố Mộng Mơ', 'Chinh phục các thác nước và tận hưởng không khí lạnh.', 'Đà Lạt', 7500000, 3, 'Thác Datanla,Thung lũng Tình Yêu,Quảng trường Lâm Viên', '["Day 1: Waterfall hunt", "Day 2: Flower Park", "Day 3: Coffee and Pine Forest"]', '["https://images.unsplash.com/photo-1541973369761-1249fa6b2fc1"]', 'h007', 'f007', 'p008,p010', 'Duy trì thân nhiệt tốt vì đêm ở Đà Lạt khá lạnh.', NOW()),
('t008', 'Quy Nhơn - Kỳ Co Eo Gió', 'Vẻ đẹp hoang sơ của những bãi biển miền Trung.', 'Quy Nhơn', 11000000, 3, 'Kỳ Co,Eo Gió,Hòn Khô,Ghềnh Ráng Ti Sa', '["Day 1: Beach day", "Day 2: Windy Pass", "Day 3: Local culture"]', '["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b"]', 'h001', 'f006', 'p003', 'Check-in tại Kỳ Co vào sáng sớm để tránh nắng.', NOW()),
('t009', 'Hạ Long - Kỳ Quan Giữa Biển Mây', 'Ngủ đêm trên du thuyền và tham quan hang động.', 'Hạ Long', 6000000, 2, 'Du thuyền 5 sao,Hang Sửng Sốt,Đảo Ti Tốp,Chèo Kayak', '["Day 1: Cruise boarding", "Day 2: Cave excursion"]', '["https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e"]', 'h009', 'f001', 'p002', 'Mang theo túi chống nước cho điện thoại khi chèo thuyền.', NOW()),
('t010', 'Sapa - Nơi Gặp Gỡ Đất Trời', 'Leo núi Fansipan và khám phá bản làng.', 'Sapa', 13000000, 3, 'Đỉnh Fansipan,Bản Cát Cát,Nhà thờ đá,Cáp treo', '["Day 1: Village Trek", "Day 2: Fansipan Peak", "Day 3: Market day"]', '["https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9"]', 'h010', 'f001', 'p001', 'Hãy trang bị giày leo núi chuyên dụng.', NOW());

-- 8. CHÈN DỮ LIỆU ĐÁNH GIÁ (REVIEWS)
INSERT INTO reviews (id, user_id, service_id, service_type, rating, comment, created_at) VALUES
('rev001', 'u003', 't001', 'TOUR', 5, 'Chuyến đi tuyệt vời, dịch vụ rất chuyên nghiệp!', NOW()),
('rev002', 'u004', 't002', 'TOUR', 4, 'Biển rất đẹp nhưng thời tiết hơi nóng.', NOW()),
('rev003', 'u005', 'h002', 'HOTEL', 5, 'Khách sạn Metropole là một trải nghiệm không thể quên.', NOW()),
('rev004', 'u006', 'f001', 'FLIGHT', 4, 'Chuyến bay đúng giờ, nhân viên thân thiện.', NOW()),
('rev005', 'u007', 'p001', 'POI', 5, 'Cầu Vàng thực sự là một kiến trúc ấn tượng.', NOW()),
('rev006', 'u008', 't001', 'TOUR', 5, 'Dịch vụ của TravelWithMe rất tốt, sẽ quay lại.', NOW()),
('rev007', 'u009', 'h003', 'HOTEL', 5, 'Resort ở Phú Quốc rất đẹp, thức ăn ngon.', NOW()),
('rev008', 'u010', 't005', 'TOUR', 4, 'Hà Nội mùa thu rất đẹp, tour sắp xếp ổn.', NOW()),
('rev009', 'u003', 't010', 'TOUR', 5, 'Đỉnh Fansipan rất hùng vĩ, trải nghiệm đáng giá.', NOW()),
('rev010', 'u004', 'f010', 'FLIGHT', 5, 'Bamboo bay quốc tế rất xịn, ghế rộng.', NOW());
