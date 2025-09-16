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
    private Sector sector; // one-way için
    private Sector outbound; // round-trip için
    private Sector inbound; // round-trip için
    private Stopover stopover; // round-trip için


    public boolean isRoundTrip() {
        return outbound != null && inbound != null;
    }

    public boolean isOneWay() {
        return sector != null && outbound == null && inbound == null;
    }
}

