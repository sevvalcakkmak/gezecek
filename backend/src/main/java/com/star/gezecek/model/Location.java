package com.star.gezecek.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@RedisHash("location")
public class Location {
    @Id
    private String id;
    private String name;
    private String code; // Could be airport code, city code, etc.
    private String type; // AIRPORT, CITY, COUNTRY
    private String countryCode;
    private Map<String, Double> coordinates; // lat, lng
    private String timezone;
    private String parentLocationId; // e.g., airport belongs to city
}