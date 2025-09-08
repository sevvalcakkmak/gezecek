package com.star.gezecek.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserPreferences implements Serializable {

    //private CabinClass defaultCabinClass = CabinClass.ECONOMY;
    //private SortBy defaultSortBy = SortBy.PRICE;
    private String preferredCurrency = "USD";
    private String preferredLanguage = "en";
    //private PriceRange budgetRange;
    private List<String> frequentAirports = new ArrayList<>(); // Frequently used airports

    // Constructors
    public UserPreferences() {
        this.frequentAirports = new ArrayList<>();
    }
   }
