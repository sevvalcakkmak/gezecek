package com.star.gezecek.dto.request;

import com.star.gezecek.model.enums.TripType;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FlightSearchRequest {
    // Required parameters
    @NotNull
    private String source;
    @NotNull
    private String destination;

    @Builder.Default
    private TripType tripType = TripType.ONE_WAY;

    /*@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime departureDate;

    // Optional for round trip
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime returnDate; */

    /*// Optional parameters with defaults
    @Builder.Default
    private CabinClass cabinClass = CabinClass.ECONOMY;

    @Builder.Default
    private Integer adults = 1;

    private Integer children;
    private Integer infants;

    @Builder.Default
    private SortBy sortBy = SortBy.PRICE;

    private Integer maxStops;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;

    // Additional filters
    private List<String> preferredAirlines;
    private List<String> excludedAirlines; */
}