package com.star.gezecek.dto.request;

import com.star.gezecek.model.enums.TripType;
import lombok.Data;

// Simple request DTO for the external API
@Data
public class ExternalSearchRequest {
    private String source;
    private String destination;
    private String departureDate;
    private String returnDate; // null for one-way
    private String cabinClass;
    private int adults;
    private int children;
    private int infants;
    private int maxStops;
}
