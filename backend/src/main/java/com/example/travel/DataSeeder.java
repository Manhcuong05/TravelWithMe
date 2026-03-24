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
                        if (repository.count() == 0) {
                                repository.save(Tour.builder()
                                                .title("Hành trình Di sản Miền Trung (Combo 5 Sao)")
                                                .description(
                                                                "Khám phá vẻ đẹp cổ kính của Huế, Hội An và sự hiện đại của Đà Nẵng trong hành trình 5 ngày 4 đêm. Trọn gói khách sạn 5 sao và vé máy bay hạng thương gia.")
                                                .location("Đà Nẵng - Huế - Hội An")
                                                .price(15900000)
                                                .durationDays(5)
                                                .highlights("Khách sạn 5 sao,Vé máy bay thương gia,Buffet hải sản,Hướng dẫn viên chuyên nghiệp")
                                                .hotelId("premium-hotel-01")
                                                .flightId("business-flight-01")
                                                .poiIds("poi-hue,poi-hoian,poi-banahills")
                                                .aiSuggestions(
                                                                "Nên mang theo trang phục nhẹ nhàng, máy ảnh và kem chống nắng. Buổi tối tại Hội An rất đẹp cho các hoạt động đi dạo và thả đèn hoa đăng.")
                                                .build());

                                repository.save(Tour.builder()
                                                .title("Nghỉ dưỡng Đảo Ngọc Phú Quốc (Combo Luxury)")
                                                .description(
                                                                "Tận hưởng kỳ nghỉ dưỡng tại bãi biển đẹp nhất Phú Quốc. Combo bao gồm nghỉ dưỡng tại Vinpearl và vé vui chơi VinWonders.")
                                                .location("Phú Quốc")
                                                .price(12500000)
                                                .durationDays(3)
                                                .highlights("Nghỉ dưỡng Vinpearl,Vé VinWonders,Sunset Sanato,Lặn ngắm san hô")
                                                .hotelId("vinpearl-pq-01")
                                                .flightId("vnairlines-01")
                                                .poiIds("poi-vinwonders,poi-sunset-sanato")
                                                .aiSuggestions(
                                                                "Thời điểm đẹp nhất là từ tháng 11 đến tháng 4. Bạn nên thử món bún quậy Kiến Xây và gỏi cá trích đặc sản.")
                                                .build());

                                System.out.println("DEBUG: Seeded local data for Tours");
                        }
                };
        }
}
