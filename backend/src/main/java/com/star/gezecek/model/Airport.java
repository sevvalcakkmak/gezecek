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
@RedisHash("airport")
public class Airport {
    @Id
    private String code; // IATA code (e.g., "JFK")
    private String name;
    private String cityName;
    private String countryCode;
    private Map<String, Double> coordinates; // lat, lng
    private String localTime;
    private String utcTime;}