package com.star.gezecek.dto.response;

import lombok.Data;

@Data
public class Station {
    private String id;
    private String legacyId;
    private String name;
    private String code;
    private String type;
    private Gps gps;
    private City city;
    private Country country;
}
