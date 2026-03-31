package com.example.travel.core.controller;

import com.example.travel.core.service.ReportService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/revenue/export")
    @PreAuthorize("hasAnyRole('ADMIN', 'CTV')") // Let Admin and CTV export reports
    public void exportRevenueReport(
            @RequestParam(name = "startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(name = "endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(name = "serviceType", required = false, defaultValue = "ALL") String serviceType,
            HttpServletResponse response) throws IOException {
        
        response.setContentType("application/pdf");
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=RevenueReport_" + startDate + "_to_" + endDate + ".pdf";
        response.setHeader(headerKey, headerValue);

        reportService.generateRevenueReport(response, startDate, endDate, serviceType);
    }
}
