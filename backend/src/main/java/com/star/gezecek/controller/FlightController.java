package com.star.gezecek.controller;

import com.star.gezecek.config.FlightApiConfig;
import com.star.gezecek.dto.request.FlightSearchRequest;
import com.star.gezecek.dto.response.ExternalApiResponse;
import com.star.gezecek.model.FlightSearchResult;
import com.star.gezecek.model.enums.TripType;
import com.star.gezecek.service.FlightSearchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/flights")
@Validated
@RequiredArgsConstructor
@Slf4j
public class FlightController {
    private final RestTemplate restTemplate = new RestTemplate();

    private final FlightSearchService flightSearchService;
    private final FlightApiConfig apiConfig;

    @GetMapping("/test")
    public ExternalApiResponse testFlights() {
        String url = "https://kiwi-com-cheap-flights.p.rapidapi.com/one-way?source=City:ankara_tr&destination=City:istanbul_tr";

        HttpHeaders headers = new HttpHeaders();
        headers.set("x-rapidapi-host", apiConfig.getApiHost());
        headers.set("x-rapidapi-key", apiConfig.getApiKey());

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<ExternalApiResponse> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                ExternalApiResponse.class
        );

        return response.getBody();
    }


    @PostMapping("/one-way")
    public ResponseEntity<FlightSearchResult> searchOneWay(
            @Valid @RequestBody FlightSearchRequest request) {

        log.info("Received one-way flight search request: {}", request);
        request.setTripType(TripType.ONE_WAY);

        FlightSearchResult result = flightSearchService.searchFlights(request);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/round-trip")
    public ResponseEntity<FlightSearchResult> searchRoundTrip(
            @Valid @RequestBody FlightSearchRequest request) {

        log.info("Received round-trip flight search request: {}", request);
        request.setTripType(TripType.ROUND_TRIP);

        FlightSearchResult result = flightSearchService.searchFlights(request);
        return ResponseEntity.ok(result);
    }

    // Optionally: retrieve search results later
    @GetMapping("/{searchId}")
    public ResponseEntity<FlightSearchResult> getSearchResult(@PathVariable String searchId) {
        return ResponseEntity.ok(flightSearchService.getSearchResult(searchId));
    }
}

