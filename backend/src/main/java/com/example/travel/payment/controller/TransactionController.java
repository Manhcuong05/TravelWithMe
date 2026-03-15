package com.example.travel.payment.controller;

import com.example.travel.core.response.ApiResponse;
import com.example.travel.payment.dto.TransactionRequest;
import com.example.travel.payment.dto.TransactionResponse;
import com.example.travel.payment.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'CTV')")
    public ApiResponse<List<TransactionResponse>> getAllTransactions() {
        return ApiResponse.success(transactionService.getAllTransactions(), "Lấy danh sách giao dịch thành công");
    }

    @PostMapping("/process")
    public ApiResponse<TransactionResponse> processPayment(@Valid @RequestBody TransactionRequest request) {
        return ApiResponse.success(transactionService.processPayment(request), "Thanh toán thành công");
    }
}
