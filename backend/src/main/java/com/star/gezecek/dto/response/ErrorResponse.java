package com.star.gezecek.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ErrorResponse {
    private String code;
    private String message;
    private LocalDateTime timestamp;

    public ErrorResponse(String code, String message) {
        this.code = code;
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }
}
