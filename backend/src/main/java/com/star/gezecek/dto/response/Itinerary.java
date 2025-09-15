package com.star.gezecek.dto.response;

import lombok.Data;

@Data
public class Itinerary {
    private String id;
    private String shareId;
    private FlightPrice price;
    private ApiProvider provider;
    private BagsInfo bagsInfo;
    private BookingOptions bookingOptions;
    private Sector sector;
}
