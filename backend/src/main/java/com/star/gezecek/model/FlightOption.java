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
@RedisHash("flight_option")
public class FlightOption {
    @Id
    private String id;
    private String searchId; // Reference to FlightSearchResult
    private BigDecimal price;
    private String currency;
    private String bookingUrl;
    private Integer quality; // 0-100 score
    private Integer popularity; // 0-100 score
    private Boolean isRefundable;
    private String baggageInfo;
    private Integer totalDurationMinutes;
    private Integer totalStops;
    private List<String> flightSegmentIds; // References to FlightSegment entities
    private Map<String, Object> additionalInfo; // Extra data from API
    private LocalDateTime expiresAt;
}