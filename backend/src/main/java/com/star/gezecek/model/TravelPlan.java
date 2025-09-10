package com.star.gezecek.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@RedisHash("travel_plan")
public class TravelPlan {
    @Id
    private String id;
    private String name;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String status; // DRAFT, ACTIVE, COMPLETED, CANCELLED
    private String tripType; // ONE_WAY, ROUND_TRIP, MULTI_CITY
    private Map<String, Object> dates; // departure, return dates
    private Map<String, BigDecimal> estimatedTotalCost; // amount, currency
    private String notes;
    private List<String> tags;

    // References to search results
    private List<String> flightSearchResultIds;
    private List<String> hotelSearchResultIds;
    private List<String> poiSearchResultIds;

    // Selected options
    private String selectedFlightOptionId;
    private List<String> selectedHotelOptionIds;
    private List<String> selectedPOIIds;
}