package com.star.gezecek.exception;

public class SearchResultNotFoundException extends RuntimeException {
    public SearchResultNotFoundException(String message) {
        super(message);
    }
}