package com.star.gezecek.dto.response;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

// Main API response
@Data
public class ExternalApiResponse {
    private List<Itinerary> itineraries;
}

