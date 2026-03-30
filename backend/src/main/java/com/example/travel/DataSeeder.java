package com.example.travel;

import com.example.travel.catalog.entity.Tour;
import com.example.travel.catalog.repository.TourRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {

        @Bean
        CommandLineRunner initDatabase(TourRepository repository) {
                return args -> {
                        if (repository.count() > 0) {
                                System.out.println("DEBUG: Database already contains tours. Skipping seeding.");
                                return;
                        }

                        // 1. Phú Quốc
                        repository.save(Tour.builder()
                                        .title("Khám Phá Đảo Ngọc Phú Quốc")
                                        .tourType("Cặp Đôi")
                                        .description("Tận hưởng bãi biển xanh ngắt và lặn ngắm san hồ tuyệt đẹp tại Đảo Ngọc.")
                                        .location("Phú Quốc")
                                        .price(18000000)
                                        .durationDays(3)
                                        .imagesJson("[\"https://images.unsplash.com/photo-1540202404-a2f29016bb5d?auto=format&fit=crop&q=80&w=800\"]")
                                        .build());

                        // 2. Miền Trung
                        repository.save(Tour.builder()
                                        .title("Hành Trình Di Sản Miền Trung")
                                        .tourType("Gia Đình")
                                        .description("Huế - Đà Nẵng - Hội An trong hành trình 5 ngày khám phá văn hóa.")
                                        .location("Miền Trung")
                                        .price(15000000)
                                        .durationDays(5)
                                        .imagesJson("[\"https://images.unsplash.com/photo-1555531542-741ef8c797c3?auto=format&fit=crop&q=80&w=800\"]")
                                        .build());

                        // 3. Sài Gòn
                        repository.save(Tour.builder()
                                        .title("Sài Gòn - Hòn Ngọc Viễn Đông")
                                        .tourType("Gia Đình")
                                        .description("Tham quan các điểm đến lịch sử và ẩm thực đường phố sôi động của Sài Gòn.")
                                        .location("TP. Hồ Chí Minh")
                                        .price(8000000)
                                        .durationDays(2)
                                        .imagesJson("[\"https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&q=80&w=800\"]")
                                        .build());

                        // 4. Hà Nội
                        repository.save(Tour.builder()
                                        .title("Hà Nội - Nghìn Năm Văn Hiến")
                                        .tourType("Sinh Viên")
                                        .description("Dạo quanh 36 phố phường và tận hưởng tiết trời mùa thu Hà Nội cổ kính.")
                                        .location("Hà Nội")
                                        .price(9000000)
                                        .durationDays(3)
                                        .imagesJson("[\"https://images.unsplash.com/photo-1509030450996-93f2e1d7f132?auto=format&fit=crop&q=80&w=800\"]")
                                        .build());

                        // 5. Nha Trang
                        repository.save(Tour.builder()
                                        .title("Nghỉ Dưỡng Vịnh Ninh Vân")
                                        .tourType("Luxury")
                                        .description("Trải nghiệm biệt thự biển biệt lập và đẳng cấp tại một trong những vịnh đẹp nhất thế giới.")
                                        .location("Nha Trang")
                                        .price(40000000)
                                        .durationDays(4)
                                        .imagesJson("[\"https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800\"]")
                                        .build());

                        // 6. Đà Lạt
                        repository.save(Tour.builder()
                                        .title("Đà Lạt - Thành Phố Mộng Mơ")
                                        .tourType("Cặp Đôi")
                                        .description("Chinh phục các thác nước hùng vĩ và tận hưởng không khí lạnh trong lành.")
                                        .location("Đà Lạt")
                                        .price(7500000)
                                        .durationDays(3)
                                        .imagesJson("[\"https://images.unsplash.com/photo-1599389015437-37599723ecdb?auto=format&fit=crop&q=80&w=800\"]")
                                        .build());

                        // 7. Quy Nhơn
                        repository.save(Tour.builder()
                                        .title("Quy Nhơn - Kỳ Co Eo Gió")
                                        .tourType("Sinh Viên")
                                        .description("Vẻ đẹp hoang sơ của những bãi biển miền Trung với làn nước trong xanh như ngọc.")
                                        .location("Quy Nhơn")
                                        .price(11000000)
                                        .durationDays(3)
                                        .imagesJson("[\"https://images.unsplash.com/photo-1583417641282-358057284898?auto=format&fit=crop&q=80&w=800\"]")
                                        .build());

                        // 8. Hạ Long
                        repository.save(Tour.builder()
                                        .title("Hạ Long - Kỳ Quan Giữa Biển Mây")
                                        .tourType("Luxury")
                                        .description("Ngủ đêm trên du thuyền và tham quan hang động kỳ ảo tại kỳ quan thiên nhiên thế giới.")
                                        .location("Hạ Long")
                                        .price(6000000)
                                        .durationDays(2)
                                        .imagesJson("[\"https://images.unsplash.com/photo-1524338198850-8a2ff01e4063?auto=format&fit=crop&q=80&w=800\"]")
                                        .build());

                        // 9. Sapa
                        repository.save(Tour.builder()
                                        .title("Sapa - Nơi Gặp Gỡ Đất Trời")
                                        .tourType("Mạo Hiểm")
                                        .description("Leo núi Fansipan và khám phá bản làng dân tộc với những đồng ruộng bậc thang đẹp mê hoặc.")
                                        .location("Sapa")
                                        .price(13000000)
                                        .durationDays(3)
                                        .imagesJson("[\"https://images.unsplash.com/photo-1503531336494-06990263f35f?auto=format&fit=crop&q=80&w=800\"]")
                                        .build());

                        // 10. Đà Nẵng
                        repository.save(Tour.builder()
                                        .title("Kỳ Nghỉ Thượng Lưu Đà Nẵng")
                                        .tourType("Luxury")
                                        .description("Nghỉ dưỡng 5 sao tại thành phố đáng sống nhất Việt Nam.")
                                        .location("Đà Nẵng")
                                        .price(15500000)
                                        .durationDays(4)
                                        .imagesJson("[\"https://images.unsplash.com/photo-1559592442-741ef8c797c3?auto=format&fit=crop&q=80&w=800\"]")
                                        .build());

                        System.out.println("DEBUG: Seeder Data updated with tourType and high-quality images.");
                };
        }
}
