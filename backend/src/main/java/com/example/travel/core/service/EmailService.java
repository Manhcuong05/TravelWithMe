package com.example.travel.core.service;

import com.example.travel.booking.entity.Booking;
import com.example.travel.booking.entity.BookingItem;
import com.example.travel.catalog.repository.FlightRepository;
import com.example.travel.catalog.repository.HotelRoomRepository;
import com.example.travel.catalog.repository.TourRepository;
import com.example.travel.catalog.dto.ServiceType;
import com.example.travel.identity.entity.OtpToken;
import com.example.travel.identity.entity.User;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.text.NumberFormat;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final TourRepository tourRepository;
    private final FlightRepository flightRepository;
    private final HotelRoomRepository hotelRoomRepository;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async
    public void sendBookingConfirmation(Booking booking, User user) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            // Use contact email if available, otherwise use account email
            String toEmail = (booking.getContact() != null && booking.getContact().getEmail() != null)
                    ? booking.getContact().getEmail()
                    : user.getEmail();

            String customerName = (booking.getContact() != null && booking.getContact().getFullName() != null)
                    ? booking.getContact().getFullName()
                    : user.getFullName();

            helper.setFrom(fromEmail, "TravelWithMe");
            helper.setTo(toEmail);
            helper.setSubject("✅ Xác nhận đặt dịch vụ thành công - Mã đơn #" + booking.getId().substring(0, 8).toUpperCase());
            helper.setText(buildEmailHtml(booking, customerName), true);

            mailSender.send(message);
            log.info("Booking confirmation email sent to {} for booking {}", toEmail, booking.getId());
        } catch (Exception e) {
            log.error("Failed to send booking confirmation email for booking {}", booking.getId(), e);
        }
    }

    @Async
    public void sendOtpEmail(String toEmail, String otpCode, OtpToken.OtpType type) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            String subject = type == OtpToken.OtpType.LOGIN ? "Mã Xác Thực Đăng Nhập" : "Mã Khôi Phục Mật Khẩu";

            helper.setFrom(fromEmail, "TravelWithMe");
            helper.setTo(toEmail);
            helper.setSubject("🔑 " + subject + " - TravelWithMe");
            helper.setText(buildOtpEmailHtml(otpCode, subject), true);

            mailSender.send(message);
            log.info("OTP email sent to {} for {}", toEmail, type);
        } catch (Exception e) {
            log.error("Failed to send OTP email to {}", toEmail, e);
        }
    }

    private String buildEmailHtml(Booking booking, String customerName) {
        NumberFormat currencyFormat = NumberFormat.getNumberInstance(new Locale("vi", "VN"));

        StringBuilder itemsHtml = new StringBuilder();
        for (BookingItem item : booking.getItems()) {
            String serviceName = resolveServiceName(item);
            double itemTotal = item.getPriceAtBooking() * (item.getQuantity() != null ? item.getQuantity() : 1);

            itemsHtml.append("""
                    <tr>
                        <td style="padding: 12px; border-bottom: 1px solid #2a2a2a;">%s</td>
                        <td style="padding: 12px; border-bottom: 1px solid #2a2a2a; text-align: center;">%d</td>
                        <td style="padding: 12px; border-bottom: 1px solid #2a2a2a; text-align: right; color: #c9a84c;">%s ₫</td>
                    </tr>
                    """.formatted(serviceName, item.getQuantity() != null ? item.getQuantity() : 1,
                    currencyFormat.format(itemTotal)));
        }

        String bookingCode = booking.getId().substring(0, 8).toUpperCase();

        return """
                <!DOCTYPE html>
                <html lang="vi">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Xác Nhận Đặt Dịch Vụ</title>
                </head>
                <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Helvetica Neue', Arial, sans-serif;">
                    <table width="100%%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 0;">
                        <tr>
                            <td align="center">
                                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #111111; border: 1px solid #2a2a2a; border-radius: 12px; overflow: hidden; max-width: 600px;">
                                    <!-- Header -->
                                    <tr>
                                        <td style="background: linear-gradient(135deg, #1a1a1a 0%%, #0a0a0a 100%%; padding: 40px; text-align: center; border-bottom: 1px solid #c9a84c;">
                                            <h1 style="margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 4px; color: #c9a84c; text-transform: uppercase;">TravelWithMe</h1>
                                            <p style="margin: 8px 0 0; font-size: 11px; letter-spacing: 3px; color: #666; text-transform: uppercase;">Premium Travel Experience</p>
                                        </td>
                                    </tr>
                                    <!-- Body -->
                                    <tr>
                                        <td style="padding: 40px;">
                                            <div style="text-align: center; margin-bottom: 32px;">
                                                <div style="display: inline-block; width: 64px; height: 64px; background: linear-gradient(135deg, #c9a84c, #f0d080); border-radius: 50%%; line-height: 64px; font-size: 28px; margin-bottom: 16px;">✓</div>
                                                <h2 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 400;">Đặt Dịch Vụ Thành Công</h2>
                                                <p style="margin: 8px 0 0; color: #888; font-size: 14px;">Cảm ơn bạn đã tin tưởng TravelWithMe</p>
                                            </div>

                                            <!-- Greeting -->
                                            <p style="color: #cccccc; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
                                                Xin chào <strong style="color: #c9a84c;">%s</strong>,<br>
                                                Đơn hàng của bạn đã được xác nhận và thanh toán thành công. Dưới đây là thông tin chi tiết:
                                            </p>

                                            <!-- Booking Code -->
                                            <div style="background-color: #1a1a1a; border: 1px solid #c9a84c; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 24px;">
                                                <p style="margin: 0; font-size: 11px; letter-spacing: 2px; color: #888; text-transform: uppercase;">Mã Đơn Hàng</p>
                                                <p style="margin: 8px 0 0; font-size: 24px; font-weight: 700; color: #c9a84c; letter-spacing: 4px;">#%s</p>
                                            </div>

                                            <!-- Items table -->
                                            <table width="100%%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                                                <thead>
                                                    <tr style="background-color: #1a1a1a;">
                                                        <th style="padding: 12px; text-align: left; font-size: 11px; letter-spacing: 1px; color: #888; text-transform: uppercase; border-bottom: 1px solid #c9a84c;">Dịch Vụ</th>
                                                        <th style="padding: 12px; text-align: center; font-size: 11px; letter-spacing: 1px; color: #888; text-transform: uppercase; border-bottom: 1px solid #c9a84c;">SL</th>
                                                        <th style="padding: 12px; text-align: right; font-size: 11px; letter-spacing: 1px; color: #888; text-transform: uppercase; border-bottom: 1px solid #c9a84c;">Thành Tiền</th>
                                                    </tr>
                                                </thead>
                                                <tbody style="color: #cccccc; font-size: 14px;">
                                                    %s
                                                </tbody>
                                            </table>

                                            <!-- Total -->
                                            <div style="background-color: #1a1a1a; border-radius: 8px; padding: 16px; display: flex; justify-content: space-between; margin-bottom: 32px;">
                                                <table width="100%%">
                                                    <tr>
                                                        <td style="color: #888; font-size: 13px;">Trạng thái</td>
                                                        <td style="text-align: right; color: #4caf50; font-weight: 600;">✓ Đã xác nhận</td>
                                                    </tr>
                                                    <tr>
                                                        <td style="color: #888; font-size: 13px; padding-top: 8px;">Tổng thanh toán</td>
                                                        <td style="text-align: right; font-size: 20px; font-weight: 700; color: #c9a84c; padding-top: 8px;">%s ₫</td>
                                                    </tr>
                                                </table>
                                            </div>

                                            <p style="color: #666; font-size: 13px; line-height: 1.6; text-align: center;">
                                                Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email hoặc hotline.<br>
                                                Chúc bạn có một hành trình tuyệt vời! 🌟
                                            </p>
                                        </td>
                                    </tr>
                                    <!-- Footer -->
                                    <tr>
                                        <td style="background-color: #0a0a0a; padding: 24px; text-align: center; border-top: 1px solid #2a2a2a;">
                                            <p style="margin: 0; font-size: 11px; letter-spacing: 2px; color: #444; text-transform: uppercase;">© 2025 TravelWithMe — Premium Travel Experience</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
                """.formatted(customerName, bookingCode, itemsHtml.toString(),
                currencyFormat.format(booking.getTotalAmount()));
    }

    private String buildOtpEmailHtml(String code, String title) {
        return """
                <!DOCTYPE html>
                <html lang="vi">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Helvetica Neue', Arial, sans-serif;">
                    <table width="100%%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 0;">
                        <tr>
                            <td align="center">
                                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #111111; border: 1px solid #2a2a2a; border-radius: 12px; overflow: hidden; max-width: 600px;">
                                    <tr>
                                        <td style="background: linear-gradient(135deg, #1a1a1a 0%%, #0a0a0a 100%%; padding: 40px; text-align: center; border-bottom: 1px solid #c9a84c;">
                                            <h1 style="margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 4px; color: #c9a84c; text-transform: uppercase;">TravelWithMe</h1>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 40px; text-align: center;">
                                            <h2 style="margin: 0 0 24px 0; color: #ffffff; font-size: 22px; font-weight: 400;">%s</h2>
                                            <p style="color: #cccccc; font-size: 15px; line-height: 1.6; margin-bottom: 32px;">
                                                Bạn đang yêu cầu mã xác thực. Dưới đây là mã OTP của bạn.<br>
                                                Mã này <strong style="color: #c9a84c;">chỉ có hiệu lực trong 10 phút</strong> và chỉ sử dụng được 1 lần.
                                            </p>
                                            <div style="background-color: #1a1a1a; border: 1px solid #c9a84c; border-radius: 8px; padding: 24px; margin-bottom: 32px; display: inline-block;">
                                                <p style="margin: 0; font-size: 36px; font-weight: 700; color: #c9a84c; letter-spacing: 8px;">%s</p>
                                            </div>
                                            <p style="color: #888; font-size: 13px; line-height: 1.6;">
                                                Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email và đảm bảo tài khoản của bạn an toàn.
                                            </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="background-color: #0a0a0a; padding: 24px; text-align: center; border-top: 1px solid #2a2a2a;">
                                            <p style="margin: 0; font-size: 11px; letter-spacing: 2px; color: #444; text-transform: uppercase;">© 2025 TravelWithMe</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
                """.formatted(title, code);
    }

    private String resolveServiceName(BookingItem item) {
        try {
            if (item.getServiceType() == ServiceType.TOUR) {
                return tourRepository.findById(item.getServiceId())
                        .map(t -> "🗺 Tour: " + t.getTitle())
                        .orElse("Tour du lịch");
            } else if (item.getServiceType() == ServiceType.FLIGHT) {
                return flightRepository.findById(item.getServiceId())
                        .map(f -> "✈ Chuyến bay: " + f.getDepartureCity() + " → " + f.getArrivalCity())
                        .orElse("Vé máy bay");
            } else if (item.getServiceType() == ServiceType.HOTEL) {
                return hotelRoomRepository.findById(item.getServiceId())
                        .map(r -> "🏨 Khách sạn: " + r.getRoomType())
                        .orElse("Phòng khách sạn");
            }
        } catch (Exception e) {
            log.warn("Could not resolve service name for item {}", item.getServiceId());
        }
        return "Dịch vụ du lịch";
    }
}
