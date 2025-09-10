package com.star.gezecek.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.star.gezecek.model.enums.CabinClass;
import com.star.gezecek.model.enums.SortBy;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class FlightSearchRequest {
    // Required parameters
    @NotNull
    private String origin;
    @NotNull
    private String destination;
    @NotNull
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate departureDate;

    // Optional for round trip
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate returnDate;

    // Optional parameters with defaults
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
    private List<String> excludedAirlines;
}