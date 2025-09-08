package com.star.gezecek.repository;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.star.gezecek.model.UserSession;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

@Repository
public class UserSessionRepository {

    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper mapper;
    private static final String KEY = "UserSession";

    public UserSessionRepository(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
        this.mapper = new ObjectMapper();
        this.mapper.registerModule(new JavaTimeModule());
        this.mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        this.mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    public void save(UserSession session) {
        redisTemplate.opsForHash().put(KEY, session.getSessionId(), session);
    }

    public UserSession findById(String sessionId) {
        Object obj = redisTemplate.opsForHash().get(KEY, sessionId);
        if (obj == null) {
            return null;
        }

        try {
            if (obj instanceof UserSession) {
                return (UserSession) obj;
            } else if (obj instanceof LinkedHashMap) {
                // Handle deserialization from JSON
                return mapper.convertValue(obj, UserSession.class);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to deserialize UserSession", e);
        }
        return null;
    }

    public Map<String, UserSession> findAll() {
        Map<Object, Object> entries = redisTemplate.opsForHash().entries(KEY);
        Map<String, UserSession> result = new HashMap<>();

        for (Map.Entry<Object, Object> entry : entries.entrySet()) {
            String key = String.valueOf(entry.getKey());
            Object value = entry.getValue();

            try {
                if (value instanceof UserSession) {
                    result.put(key, (UserSession) value);
                } else if (value instanceof LinkedHashMap) {
                    UserSession session = mapper.convertValue(value, UserSession.class);
                    result.put(key, session);
                }
            } catch (Exception e) {
                // Log error and continue with other entries
                System.err.println("Failed to deserialize session with key: " + key);
            }
        }
        return result;
    }

    public void delete(String sessionId) {
        redisTemplate.opsForHash().delete(KEY, sessionId);
    }

    public boolean exists(String sessionId) {
        return redisTemplate.opsForHash().hasKey(KEY, sessionId);
    }
}