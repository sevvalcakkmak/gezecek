package com.star.gezecek.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.redis.core.RedisHash;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@RedisHash("baggage_info")
public class BaggageInfo {
    private BagDetails handBags;
    private BagDetails checkedBags;
}

