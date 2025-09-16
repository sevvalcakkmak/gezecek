package com.star.gezecek.dto.response;

import com.star.gezecek.model.Station;
import lombok.Data;

@Data
public class TimeInfo {
    private String localTime;
    private String utcTime;
    private Station station;
}
