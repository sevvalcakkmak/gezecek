package com.star.gezecek.dto.response;

import lombok.Data;

@Data
public class Stopover {
    private Integer nightsCount;
    private StopoverArrival arrival;
    private StopoverDeparture departure;
    private Integer duration;
}
