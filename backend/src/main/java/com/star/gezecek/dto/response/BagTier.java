package com.star.gezecek.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class BagTier {
    private FlightPrice tierPrice;
    private List<Bag> bags;
}
