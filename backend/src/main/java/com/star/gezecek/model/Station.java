package com.star.gezecek.model;

import com.star.gezecek.dto.response.City;
import com.star.gezecek.dto.response.Country;
import com.star.gezecek.dto.response.Gps;
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
@RedisHash("station")
public class Station {
    private String id;
    private String legacyId;
    private String name;
    private String code;
    private String type;
    private Gps gps;
    private City city;
    private Country country;
}

