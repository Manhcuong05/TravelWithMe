package com.example.travel.catalog.service;

import com.example.travel.catalog.dto.FlightClassDto;
import com.example.travel.catalog.dto.FlightRequest;
import com.example.travel.catalog.dto.FlightResponse;
import com.example.travel.catalog.entity.Flight;
import com.example.travel.catalog.entity.FlightClass;
import com.example.travel.catalog.repository.FlightRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
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
                .aircraft(request.getAircraft())
                .build();

        if (flight.getFlightClasses() == null) {
            flight.setFlightClasses(new java.util.ArrayList<>());
        }

        if (request.getFlightClasses() != null) {
            request.getFlightClasses().forEach(dto -> {
                flight.getFlightClasses().add(FlightClass.builder()
                        .flight(flight)
                        .className(dto.getClassName())
                        .priceAdult(dto.getPriceAdult())
                        .priceChild(dto.getPriceChild())
                        .priceInfant(dto.getPriceInfant())
                        .totalSeats(dto.getTotalSeats())
                        .availableSeats(dto.getAvailableSeats() == 0 ? dto.getTotalSeats() : dto.getAvailableSeats())
                        .baggageAllowanceKg(dto.getBaggageAllowanceKg())
                        .build());
            });
        }
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
        flight.setAircraft(request.getAircraft());

        if (flight.getFlightClasses() != null) {
            flight.getFlightClasses().clear();
        } else {
            flight.setFlightClasses(new java.util.ArrayList<>());
        }

        if (request.getFlightClasses() != null) {
            request.getFlightClasses().forEach(dto -> {
                flight.getFlightClasses().add(FlightClass.builder()
                        .flight(flight)
                        .className(dto.getClassName())
                        .priceAdult(dto.getPriceAdult())
                        .priceChild(dto.getPriceChild())
                        .priceInfant(dto.getPriceInfant())
                        .totalSeats(dto.getTotalSeats())
                        .availableSeats(dto.getAvailableSeats() == 0 ? dto.getTotalSeats() : dto.getAvailableSeats())
                        .baggageAllowanceKg(dto.getBaggageAllowanceKg())
                        .build());
            });
        }

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
        java.util.List<FlightClassDto> classDtos = new java.util.ArrayList<>();
        if (flight.getFlightClasses() != null) {
            classDtos = flight.getFlightClasses().stream().map(fc -> FlightClassDto.builder()
                    .id(fc.getId())
                    .className(fc.getClassName())
                    .priceAdult(fc.getPriceAdult())
                    .priceChild(fc.getPriceChild())
                    .priceInfant(fc.getPriceInfant())
                    .totalSeats(fc.getTotalSeats())
                    .availableSeats(fc.getAvailableSeats())
                    .baggageAllowanceKg(fc.getBaggageAllowanceKg())
                    .build()).collect(Collectors.toList());
        }

        return FlightResponse.builder()
                .id(flight.getId())
                .flightNumber(flight.getFlightNumber())
                .airline(flight.getAirline())
                .departureCity(flight.getDepartureCity())
                .arrivalCity(flight.getArrivalCity())
                .departureTime(flight.getDepartureTime())
                .arrivalTime(flight.getArrivalTime())
                .flightClasses(classDtos)
                .build();
    }
}
