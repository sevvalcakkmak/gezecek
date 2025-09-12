package com.star.gezecek.dto.response;

import lombok.Data;

@Data
public class BookingOptionNode {
    //private String token;
    private String bookingUrl;
    //private String trackingPixel;
    //private ItineraryProvider itineraryProvider;
    private FlightPrice price;
}
