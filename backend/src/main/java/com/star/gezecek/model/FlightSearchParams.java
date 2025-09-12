package com.star.gezecek.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@RedisHash("flight_search_params")
public class FlightSearchParams {
    @Id
    private String searchId;
    private String tripType; // ONE_WAY, ROUND_TRIP
    private String originLocationId;
    private String destinationLocationId;
    private LocalDateTime departureDate;
    private LocalDateTime returnDate;
    private String cabinClass; // ECONOMY, BUSINESS, FIRST
    private String sortBy; // PRICE, DURATION, DEPARTURE_TIME
    private Integer maxStopsCount;
    private BigDecimal priceStart;
    private BigDecimal priceEnd;
    private Integer adults;
    private Integer children;
    private Integer infants;
    private List<String> preferredAirlines;
    private List<String> excludedAirlines;
}