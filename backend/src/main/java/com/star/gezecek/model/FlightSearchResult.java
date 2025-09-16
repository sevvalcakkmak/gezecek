package com.star.gezecek.model;

import com.star.gezecek.model.enums.TripType;
import lombok.*;
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
    private TripType tripType;
    private LocalDateTime timestamp;
    private Integer totalResults;
    private FlightSearchParams searchParams;
    private List<FlightOption> flightOptions; //FlightOption entities
    private String status; // SEARCHING, COMPLETED, FAILED
    private String errorMessage;
    private Long processingTimeMs;
}
