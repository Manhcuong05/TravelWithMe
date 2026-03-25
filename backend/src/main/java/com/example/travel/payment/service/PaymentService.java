package com.example.travel.payment.service;

import com.example.travel.booking.entity.Booking;
import com.example.travel.booking.repository.BookingRepository;
import com.example.travel.identity.repository.UserRepository;
import com.example.travel.core.exception.BusinessException;
import com.example.travel.core.service.EmailService;
import com.example.travel.payment.dto.PaymentInitResponse;
import com.example.travel.payment.entity.Transaction;
import com.example.travel.payment.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final BookingRepository bookingRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

        @Transactional
        public PaymentInitResponse initializePayment(String bookingId) {
                Booking booking = bookingRepository.findById(bookingId)
                                .orElseThrow(() -> new BusinessException("BOOKING_NOT_FOUND",
                                                "Không tìm thấy đơn hàng"));

                if (booking.getStatus() != Booking.BookingStatus.PENDING
                                && booking.getStatus() != Booking.BookingStatus.AWAITING_PAYMENT) {
                        throw new BusinessException("INVALID_BOOKING_STATUS",
                                        "Đơn hàng đã được thanh toán hoặc đã bị hủy");
                }

                // Ownership Check
                String currentUserEmail = com.example.travel.core.util.SecurityUtil.getCurrentUserEmail();
                com.example.travel.identity.entity.User user = userRepository.findByEmail(currentUserEmail)
                                .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "Người dùng không tồn tại"));

                if (!booking.getUserId().equals(user.getId())
                                && user.getRole() != com.example.travel.core.constant.Role.ADMIN
                                && user.getRole() != com.example.travel.core.constant.Role.CTV) {
                        throw new BusinessException("ACCESS_DENIED", "Bạn không có quyền thanh toán cho đơn hàng này");
                }

                String reference = "TRV" + System.currentTimeMillis();

                Transaction transaction = Transaction.builder()
                                .bookingId(bookingId)
                                .amount(booking.getTotalAmount())
                                .paymentMethod("VietQR")
                                .transactionReference(reference)
                                .status(Transaction.TransactionStatus.PENDING)
                                .build();

                transactionRepository.save(transaction);

                booking.setStatus(Booking.BookingStatus.AWAITING_PAYMENT);
                bookingRepository.save(booking);

                // Mock VietQR URL generation
                String mockQrUrl = "https://img.vietqr.io/image/970422-123456789-qr_only.jpg?amount="
                                + (long) booking.getTotalAmount() + "&addInfo=" + reference;

                return PaymentInitResponse.builder()
                                .bookingId(bookingId)
                                .amount(booking.getTotalAmount())
                                .qrCodeUrl(mockQrUrl)
                                .paymentReference(reference)
                                .build();
        }

        @Transactional
        public void processPaymentSuccess(String reference) {
                Transaction transaction = transactionRepository.findByTransactionReference(reference)
                                .orElseThrow(() -> new BusinessException("TRANSACTION_NOT_FOUND",
                                                "Giao dịch không tồn tại"));

                if (transaction.getStatus() == Transaction.TransactionStatus.SUCCESS) {
                        return;
                }

                transaction.setStatus(Transaction.TransactionStatus.SUCCESS);
                transactionRepository.save(transaction);

                Booking booking = bookingRepository.findById(transaction.getBookingId())
                                .orElseThrow(() -> new BusinessException("BOOKING_NOT_FOUND",
                                                "Đơn hàng liên quan không tồn tại"));

        booking.setStatus(Booking.BookingStatus.CONFIRMED);
        bookingRepository.save(booking);

        // Send confirmation email asynchronously
        userRepository.findById(booking.getUserId()).ifPresent(user -> {
            emailService.sendBookingConfirmation(booking, user);
        });
    }
}
