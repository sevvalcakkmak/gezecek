package com.star.gezecek.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Getter
@Setter
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserSession implements Serializable {

    private String sessionId;
    private LocalDateTime createdAt;
    private LocalDateTime lastActivity;
    private LocalDateTime expiresAt;
    private UserPreferences preferences;
    private List<String> currentSearchIds; // Cache edilen search'lerin ID'leri

    // Constructor with sessionId only
    public UserSession(String sessionId) {
        this.sessionId = sessionId;
        this.createdAt = LocalDateTime.now();
        this.preferences = new UserPreferences();
        this.currentSearchIds = new ArrayList<>();
        updateActivity();
    }

    // Update activity timestamp
    public void updateActivity() {
        this.lastActivity = LocalDateTime.now();
        this.expiresAt = LocalDateTime.now().plusHours(72);
    }

    // Add search ID to current searches
    // Add search ID to current searches
    public void addSearchId(String searchId) {
        if (this.currentSearchIds == null) {
            this.currentSearchIds = new ArrayList<>();
        }
        this.currentSearchIds.add(searchId);

        // Keep only last 5 searches
        if (this.currentSearchIds.size() > 5) {
            this.currentSearchIds = new ArrayList<>(
                    this.currentSearchIds.subList(this.currentSearchIds.size() - 5, this.currentSearchIds.size())
            );
        }
    }

    // Check if session is expired
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.expiresAt);
    }
}

