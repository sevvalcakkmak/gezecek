package com.star.gezecek.dto.request;

import com.star.gezecek.model.enums.CabinClass;
import com.star.gezecek.model.enums.SortBy;
import com.star.gezecek.model.enums.SortOrder;
import lombok.Data;

// Simple request DTO for the external API
@Data
public class ExternalSearchRequest {
    private String source;
    private String destination;
    private String inboundDepartureDateStart;
    private String outboundDepartmentDateStart;

    private String currency;
    private String locale;
    private int adults;
    private int children;
    private int infants;
    private int handbags;
    private int holdbags;
    private CabinClass cabinClass;
    private SortBy sortBy;
    private SortOrder sortOrder;
    private int priceStart;
    private int priceEnd;
    private int limit;
}
