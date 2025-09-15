package com.star.gezecek.dto.response;

import com.star.gezecek.model.enums.CabinClass;
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
    private CabinClass cabinClass;
}
