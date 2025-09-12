package com.star.gezecek.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@RedisHash("flight_search_result")
public class FlightSearchResult {
    @Id
    private String searchId;
    private LocalDateTime timestamp;
    private Integer totalResults;
    private FlightSearchParams searchParams;
    private List<FlightOption> flightOptions; //FlightOption entities
    private String status; // SEARCHING, COMPLETED, FAILED
    private String errorMessage;
    private Long processingTimeMs;
}
