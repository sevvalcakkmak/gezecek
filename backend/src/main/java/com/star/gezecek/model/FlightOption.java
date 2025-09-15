package com.star.gezecek.model;

import com.star.gezecek.dto.response.FlightPrice;
import com.star.gezecek.model.enums.CabinClass;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@RedisHash("flight_option")
public class FlightOption {
    @Id
    private String id;
    private FlightPrice price;
    private String bookingUrl;
    private String providerName;
    private CarrierInfo carrier;
    private CarrierInfo operatingCarrier;
    private Airport departure;
    private Airport arrival;
    private Integer duration; // in seconds
    private BaggageInfo baggageInfo;
    private CabinClass cabinClass;
    private String searchId; // Reference to the original search
}

