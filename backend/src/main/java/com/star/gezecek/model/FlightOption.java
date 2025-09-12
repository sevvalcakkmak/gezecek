package com.star.gezecek.model;

import com.star.gezecek.dto.response.FlightPrice;
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
}