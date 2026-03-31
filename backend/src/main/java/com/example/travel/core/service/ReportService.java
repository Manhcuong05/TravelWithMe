package com.example.travel.core.service;

import com.example.travel.booking.entity.Booking;
import com.example.travel.booking.repository.BookingRepository;
import com.example.travel.catalog.dto.ServiceType;
import com.lowagie.text.Document;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.Color;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportService {

    private final BookingRepository bookingRepository;

    public void generateRevenueReport(HttpServletResponse response, LocalDate startDate, LocalDate endDate, String serviceTypeStr) throws IOException {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);
        ServiceType serviceType = (serviceTypeStr == null || serviceTypeStr.equals("ALL")) ? null : ServiceType.valueOf(serviceTypeStr);

        // Define which statuses are considered as revenue
        Collection<Booking.BookingStatus> revenueStatuses = Arrays.asList(
                Booking.BookingStatus.PAID,
                Booking.BookingStatus.COMPLETED,
                Booking.BookingStatus.CONFIRMED
        );

        // Fetch all bookings in range using fetch join to avoid LazyInitializationException
        List<Booking> filteredBookings = bookingRepository.findAllForRevenueReport(startDateTime, endDateTime, revenueStatuses)
                .stream()
                .filter(b -> {
                    if (serviceType == null) return true;
                    return b.getItems().stream().anyMatch(item -> item.getServiceType() == serviceType);
                })
                .collect(Collectors.toList());

        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, response.getOutputStream());

        document.open();
        
        // Fonts
        Font fontTitle = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        fontTitle.setSize(18);
        fontTitle.setColor(new Color(0, 51, 102));

        Font fontHeader = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        fontHeader.setSize(12);
        
        Font fontNormal = FontFactory.getFont(FontFactory.HELVETICA);
        fontNormal.setSize(10);

        // Title
        Paragraph title = new Paragraph("TRAVELWITHME - REVENUE STATEMENT", fontTitle);
        title.setAlignment(Paragraph.ALIGN_CENTER);
        document.add(title);
        
        document.add(new Paragraph(" "));

        // Sub-info
        document.add(new Paragraph("Report Period: " + startDate + " to " + endDate, fontNormal));
        document.add(new Paragraph("Service Type Filter: " + (serviceTypeStr == null ? "ALL" : serviceTypeStr), fontNormal));
        document.add(new Paragraph("Generation Date: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")), fontNormal));
        
        document.add(new Paragraph(" "));

        // Table
        PdfPTable table = new PdfPTable(5);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10);

        // Header Cells
        String[] headers = {"Booking ID", "Date", "Service(s)", "Status", "Amount"};
        for (String header : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(header, fontHeader));
            cell.setBackgroundColor(new Color(240, 240, 240));
            cell.setPadding(5);
            table.addCell(cell);
        }

        double grandTotal = 0;

        for (Booking booking : filteredBookings) {
            table.addCell(new Phrase(booking.getId().substring(0, 8), fontNormal));
            table.addCell(new Phrase(booking.getCreatedAt().toLocalDate().toString(), fontNormal));
            
            String services = booking.getItems().stream()
                    .map(item -> item.getServiceType().name())
                    .distinct()
                    .collect(Collectors.joining(", "));
            table.addCell(new Phrase(services, fontNormal));
            
            table.addCell(new Phrase(booking.getStatus().name(), fontNormal));
            
            table.addCell(new Phrase(String.format("%,.0f VND", booking.getTotalAmount()), fontNormal));
            grandTotal += booking.getTotalAmount();
        }

        document.add(table);

        // Grand Total
        document.add(new Paragraph(" "));
        Paragraph totalPara = new Paragraph("GRAND TOTAL REVENUE: " + String.format("%,.0f VND", grandTotal), fontTitle);
        totalPara.setAlignment(Paragraph.ALIGN_RIGHT);
        document.add(totalPara);

        document.close();
    }
}
