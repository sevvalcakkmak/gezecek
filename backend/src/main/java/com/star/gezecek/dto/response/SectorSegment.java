package com.star.gezecek.dto.response;

import lombok.Data;

@Data
public class SectorSegment {
    private Object guarantee; // Could be more specific if structure is known
    private Segment segment;
    private Object layover; // Could be more specific if structure is known
}
