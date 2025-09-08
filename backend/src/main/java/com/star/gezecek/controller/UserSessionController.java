package com.star.gezecek.controller;

import com.star.gezecek.model.UserSession;
import com.star.gezecek.repository.UserSessionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/sessions")
public class UserSessionController {

    private final UserSessionRepository repository;

    public UserSessionController(UserSessionRepository repository) {
        this.repository = repository;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createSession() {
        try {
            String sessionId = UUID.randomUUID().toString();
            UserSession session = new UserSession(sessionId);
            repository.save(session);

            return ResponseEntity.ok()
                    .header("Location", "/sessions/" + sessionId)
                    .body(Map.of(
                            "message", "Session created successfully",
                            "sessionId", sessionId
                    ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to create session"));
        }
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<?> getSession(@PathVariable String sessionId) {
        try {
            UserSession session = repository.findById(sessionId);
            if (session == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Session not found"));
            }

            if (session.isExpired()) {
                repository.delete(sessionId);
                return ResponseEntity.status(HttpStatus.GONE)
                        .body(Map.of("error", "Session expired"));
            }

            return ResponseEntity.ok(session);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to retrieve session"));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllSessions() {
        try {
            return ResponseEntity.ok(repository.findAll());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to retrieve sessions"));
        }
    }

    @DeleteMapping("/{sessionId}")
    public ResponseEntity<?> deleteSession(@PathVariable String sessionId) {
        try {
            if (!repository.exists(sessionId)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Session not found"));
            }

            repository.delete(sessionId);
            return ResponseEntity.ok(Map.of("message", "Session deleted: " + sessionId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to delete session"));
        }
    }
}