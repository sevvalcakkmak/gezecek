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
@RedisHash("bag_details")
public class BagDetails {
    private Integer included; // Ücretsiz dahil olan bagaj sayısı
    private List<BagTierInfo> additionalTiers; // Ek bagaj seçenekleri
}
