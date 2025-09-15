package com.star.gezecek.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class BookingOptionNode {
    private String bookingUrl;
    private ItineraryProvider itineraryProvider;
    private FlightPrice price;
}

