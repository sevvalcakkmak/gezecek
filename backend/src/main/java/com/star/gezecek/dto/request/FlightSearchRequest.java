package com.star.gezecek.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.star.gezecek.model.enums.CabinClass;
import com.star.gezecek.model.enums.SortBy;
import com.star.gezecek.model.enums.SortOrder;
import com.star.gezecek.model.enums.TripType;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FlightSearchRequest {

    @Builder.Default
    private TripType tripType = TripType.ONE_WAY;

    // Required parameters
    @NotNull
    private String source;
    @NotNull
    private String destination;

    // Optional outbound departure date range

    @JsonProperty("outboundDepartmentDateStart")
    private String outboundDepartmentDateStart;   // e.g., 2023-07-25T00:00:00
    @JsonProperty("inboundDepartureDateStart")
    private String inboundDepartureDateStart; // e.g., 2023-07-22T00:00:00
    // Optional filters
    private String currency;
    private String locale;
    private Integer adults;
    private Integer children;
    private Integer infants;
    private Integer handbags;
    private Integer holdbags;
    private CabinClass cabinClass;
    private SortBy sortBy;
    private SortOrder sortOrder;
    private Integer priceStart;
    private Integer priceEnd;
    private Integer limit;

}