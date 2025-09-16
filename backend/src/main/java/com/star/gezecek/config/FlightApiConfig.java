package com.star.gezecek.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

@Getter
@Configuration
public class FlightApiConfig {

    @Value("${flight.api.base-url}")
    private String baseUrl;

    @Value("${flight.api.key}")
    private String apiKey;

    @Value("${flight.api.host}")
    private String apiHost;

    @Value("${flight.api.timeout:30}")
    private int timeout;

    @Bean
    public RestTemplate flightApiRestTemplate() {
        RestTemplate restTemplate = new RestTemplate();

        // Add request interceptors for authentication
        restTemplate.getInterceptors().add((request, body, execution) -> {
            request.getHeaders().add("x-rapidapi-key", apiKey);
            request.getHeaders().add("x-rapidapi-host", apiHost);
            request.getHeaders().setContentType(MediaType.APPLICATION_JSON);
            return execution.execute(request, body);
        });

        // Set timeout
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(timeout * 1000);
        requestFactory.setReadTimeout(timeout * 1000);
        restTemplate.setRequestFactory(requestFactory);

        return restTemplate;
    }
}