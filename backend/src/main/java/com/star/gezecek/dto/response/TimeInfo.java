package com.star.gezecek.dto.response;

import lombok.Data;

@Data
public class TimeInfo {
    private String localTime;
    private String utcTime;
    private Station station;
}
