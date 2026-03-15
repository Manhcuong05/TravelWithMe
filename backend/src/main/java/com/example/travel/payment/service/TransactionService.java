package com.example.travel.payment.service;

import com.example.travel.booking.entity.Booking;
import com.example.travel.booking.repository.BookingRepository;
import com.example.travel.core.exception.BusinessException;
import com.example.travel.payment.dto.TransactionRequest;
import com.example.travel.payment.dto.TransactionResponse;
import com.example.travel.payment.entity.Transaction;
import com.example.travel.payment.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final BookingRepository bookingRepository;

    @Transactional
    public TransactionResponse processPayment(TransactionRequest request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new BusinessException("BOOKING_NOT_FOUND", "Không tìm thấy đơn hàng"));

        if (booking.getStatus() == Booking.BookingStatus.CONFIRMED) {
            throw new BusinessException("ALREADY_PAID", "Đơn hàng này đã được thanh toán");
        }

        if (request.getAmount() < booking.getTotalAmount()) {
            throw new BusinessException("INVALID_AMOUNT", "Số tiền thanh toán không đủ");
        }

        // Mock a transaction reference
        String ref = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Transaction transaction = Transaction.builder()
                .bookingId(booking.getId())
                .amount(request.getAmount())
                .paymentMethod(request.getPaymentMethod())
                .transactionReference(ref)
                .status(Transaction.TransactionStatus.SUCCESS)
                .build();

        Transaction savedTransaction = transactionRepository.save(transaction);

        // Update booking status
        booking.setStatus(Booking.BookingStatus.CONFIRMED);
        bookingRepository.save(booking);

        return mapToResponse(savedTransaction);
    }

    @Transactional(readOnly = true)
    public List<TransactionResponse> getAllTransactions() {
        return transactionRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private TransactionResponse mapToResponse(Transaction transaction) {
        return TransactionResponse.builder()
                .id(transaction.getId())
                .bookingId(transaction.getBookingId())
                .amount(transaction.getAmount())
                .paymentMethod(transaction.getPaymentMethod())
                .transactionReference(transaction.getTransactionReference())
                .status(transaction.getStatus())
                .createdAt(transaction.getCreatedAt())
                .build();
    }
}
