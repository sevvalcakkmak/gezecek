package com.star.gezecek.dto.response;

import lombok.Data;

@Data
public class Itinerary {
    private FlightPrice price;
    private BagsInfo bagsInfo;
    private BookingOptions bookingOptions;
}

