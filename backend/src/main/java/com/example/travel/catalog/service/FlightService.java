package com.example.travel.catalog.service;

import com.example.travel.catalog.dto.FlightRequest;
import com.example.travel.catalog.dto.FlightResponse;
import com.example.travel.catalog.entity.Flight;
import com.example.travel.catalog.repository.FlightRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FlightService {

    private final FlightRepository flightRepository;

    public FlightResponse saveFlight(FlightRequest request) {
        Flight flight = Flight.builder()
                .flightNumber(request.getFlightNumber())
                .airline(request.getAirline())
                .departureCity(request.getDepartureCity())
                .arrivalCity(request.getArrivalCity())
                .departureAirport(request.getDepartureAirport())
                .arrivalAirport(request.getArrivalAirport())
                .departureTime(request.getDepartureTime())
                .arrivalTime(request.getArrivalTime())
                .basePrice(request.getBasePrice())
                .aircraft(request.getAircraft())
                .build();
        return mapToResponse(flightRepository.save(flight));
    }

    public FlightResponse updateFlight(String id, FlightRequest request) {
        Flight flight = flightRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chuyến bay"));

        flight.setFlightNumber(request.getFlightNumber());
        flight.setAirline(request.getAirline());
        flight.setDepartureCity(request.getDepartureCity());
        flight.setArrivalCity(request.getArrivalCity());
        flight.setDepartureAirport(request.getDepartureAirport());
        flight.setArrivalAirport(request.getArrivalAirport());
        flight.setDepartureTime(request.getDepartureTime());
        flight.setArrivalTime(request.getArrivalTime());
        flight.setBasePrice(request.getBasePrice());
        flight.setAircraft(request.getAircraft());

        return mapToResponse(flightRepository.save(flight));
    }

    public void deleteFlight(String id) {
        if (!flightRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy chuyến bay để xóa");
        }
        flightRepository.deleteById(id);
    }

    public FlightResponse getFlight(String id) {
        Flight flight = flightRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chuyến bay"));
        return mapToResponse(flight);
    }

    public List<FlightResponse> searchFlights(String departure, String arrival) {
        List<Flight> flights;
        if (departure != null && arrival != null) {
            flights = flightRepository
                    .findByDepartureCityContainingIgnoreCaseAndArrivalCityContainingIgnoreCase(departure, arrival);
        } else {
            flights = flightRepository.findAll();
        }

        return flights.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private FlightResponse mapToResponse(Flight flight) {
        return FlightResponse.builder()
                .id(flight.getId())
                .flightNumber(flight.getFlightNumber())
                .airline(flight.getAirline())
                .departureCity(flight.getDepartureCity())
                .arrivalCity(flight.getArrivalCity())
                .departureTime(flight.getDepartureTime())
                .arrivalTime(flight.getArrivalTime())
                .basePrice(flight.getBasePrice())
                .build();
    }
}
