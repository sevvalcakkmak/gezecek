package com.star.gezecek.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@RedisHash("flight_segment")
public class FlightSegment {
    @Id
    private String id;
    private String flightOptionId; // Reference to FlightOption
    private String flightNumber;
    private String aircraft;
    private String carrierCode;
    private String originAirportCode;
    private String destinationAirportCode;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private Integer durationMinutes;
    private String cabinClass;
    private String bookingClass;
    private Boolean operatedBy; // If codeshare
    private String operatingCarrierCode;
}