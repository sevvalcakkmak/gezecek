package com.star.gezecek.dto.response;

import lombok.Data;

@Data
public class Segment {
    private String id;
    private TimeInfo source;
    private TimeInfo destination;
    private Integer duration;
    private String type;
    private String code;
    private Carrier carrier;
    private Carrier operatingCarrier;
    private String cabinClass;
    private Object hiddenDestination; // Could be more specific if structure is known
    private Object throwawayDestination; // Could be more specific if structure is known
}
