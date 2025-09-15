package com.star.gezecek.model;

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
@RedisHash("carrier")
public class CarrierInfo {
    @Id
    private String code; // IATA code (e.g., "AA")
    private String name;
    private String logo;
}