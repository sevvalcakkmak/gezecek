package com.star.gezecek.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class BagsInfo {
    private Integer includedCheckedBags;
    private Integer includedHandBags;
    private List<BagTier> checkedBagTiers;
    private List<BagTier> handBagTiers;
}
