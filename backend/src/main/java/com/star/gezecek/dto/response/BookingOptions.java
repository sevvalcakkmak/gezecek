package com.star.gezecek.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class BookingOptions {
    private List<BookingOptionEdge> edges;
}
