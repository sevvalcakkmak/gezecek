package com.star.gezecek.model;

import com.star.gezecek.dto.response.FlightPrice;
import com.star.gezecek.model.enums.CabinClass;
import com.star.gezecek.model.enums.TripType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@RedisHash("flight_option")
public class FlightOption {
    @Id
    private String id;
    private TripType tripType;

    private Boolean isRoundTrip;
    private FlightPrice price;
    private String bookingUrl;
    private String providerName;
    private BaggageInfo baggageInfo;
    private StopoverInfo stopoverInfo;

    // Outbound
    private Integer stopCount;
    private Airport departure; // Outbound departure
    private Airport arrival; // Outbound arrival
    private Integer duration; // Outbound duration
    private CabinClass cabinClass; // Outbound cabin class
    private CarrierInfo carrier; // Outbound carrier
    private CarrierInfo operatingCarrier; // Outbound operating carrier

    // Round-trip
    private Integer returnStopCount;
    private Airport returnDeparture;
    private Airport returnArrival;
    private Integer returnDuration;
    private CabinClass returnCabinClass;
    private CarrierInfo returnCarrier;
    private CarrierInfo returnOperatingCarrier;

    // Segment list
    private List<FlightSegment> segments;
}

