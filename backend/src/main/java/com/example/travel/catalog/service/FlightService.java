package com.example.travel.catalog.service;

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

    public List<FlightResponse> searchFlights(String departure, String arrival) {
        List<Flight> flights;
        if (departure != null && arrival != null) {
            flights = flightRepository.findByDepartureCityAndArrivalCity(departure, arrival);
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
