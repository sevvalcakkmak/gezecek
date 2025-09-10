package com.star.gezecek.model.enums;

public enum CabinClass {
    ECONOMY("M"),
    PREMIUM_ECONOMY("W"),
    BUSINESS("C"),
    FIRST("F");

    private final String code;

    CabinClass(String code) {
        this.code = code;
    }

    public String getCode() {
        return code;
    }
}