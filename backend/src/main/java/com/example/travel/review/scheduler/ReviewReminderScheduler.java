package com.example.travel.review.scheduler;

import com.example.travel.booking.entity.BookingItem;
import com.example.travel.booking.repository.BookingItemRepository;
import com.example.travel.catalog.entity.Tour;
import com.example.travel.catalog.repository.TourRepository;
import com.example.travel.core.service.EmailService;
import com.example.travel.identity.entity.User;
import com.example.travel.identity.repository.UserRepository;
import com.example.travel.booking.entity.Booking;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class ReviewReminderScheduler {

    private final BookingItemRepository bookingItemRepository;
    private final TourRepository tourRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    /**
     * Chạy lúc 9h sáng mỗi ngày.
     * Tìm tất cả booking Tour có checkOutDate = hôm qua và gửi email mời đánh giá.
     */
    @Scheduled(cron = "0 0 9 * * ?")
    public void sendReviewReminders() {
        LocalDate yesterday = LocalDate.now().minusDays(1);
        log.info("Running review reminder scheduler for date: {}", yesterday);

        List<BookingItem> items = bookingItemRepository.findTourItemsByCheckOutDate(yesterday);
        log.info("Found {} tour booking items to remind", items.size());

        for (BookingItem item : items) {
            try {
                Booking booking = item.getBooking();
                User user = userRepository.findById(booking.getUserId()).orElse(null);
                if (user == null) continue;

                // Lấy email: ưu tiên contact email, sau đó account email
                String toEmail = (booking.getContact() != null && booking.getContact().getEmail() != null)
                        ? booking.getContact().getEmail()
                        : user.getEmail();
                String customerName = (booking.getContact() != null && booking.getContact().getFullName() != null)
                        ? booking.getContact().getFullName()
                        : user.getFullName();

                // Lấy tên tour
                String tourName = tourRepository.findById(item.getServiceId())
                        .map(Tour::getTitle)
                        .orElse("Chuyến đi của bạn");

                emailService.sendReviewReminderEmail(toEmail, customerName, tourName, item.getServiceId());
                log.info("Sent review reminder to {} for tour {}", toEmail, item.getServiceId());

            } catch (Exception e) {
                log.error("Failed to send review reminder for booking item {}", item.getId(), e);
            }
        }
    }
}
