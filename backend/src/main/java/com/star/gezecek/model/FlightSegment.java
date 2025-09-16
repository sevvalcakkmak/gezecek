package com.star.gezecek.model;

import com.star.gezecek.model.enums.SegmentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@RedisHash("flight_segment")
public class FlightSegment {
    @Id
    private String id;
    private String flightNumber;
    private String carrierCode;
    private String operatingCarrierCode;
    private String originAirportCode;
    private String destinationAirportCode;
    private String departureTime;
    private String arrivalTime;
    private Integer durationMinutes;
    private String cabinClass;
}