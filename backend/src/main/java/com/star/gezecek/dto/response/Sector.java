package com.star.gezecek.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class Sector {
    private String id;
    private List<SectorSegment> sectorSegments;
    private Integer duration;
}
