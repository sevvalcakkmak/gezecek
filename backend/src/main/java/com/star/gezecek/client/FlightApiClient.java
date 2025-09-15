package com.star.gezecek.client;

import com.star.gezecek.config.FlightApiConfig;
import com.star.gezecek.dto.request.ExternalSearchRequest;
import com.star.gezecek.dto.response.ExternalApiResponse;
import com.star.gezecek.model.enums.TripType;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
@Service
@Slf4j
@Getter
public class FlightApiClient {

    private final RestTemplate restTemplate;
    private final FlightApiConfig apiConfig;

    public FlightApiClient(@Qualifier("flightApiRestTemplate") RestTemplate restTemplate,
                           FlightApiConfig apiConfig) {
        this.restTemplate = restTemplate;
        this.apiConfig = apiConfig;
    }

    public ExternalApiResponse searchFlights(ExternalSearchRequest apiRequest, TripType tripType) {
        String endpoint = tripType == TripType.ROUND_TRIP ? "/round-trip" : "/one-way";
        String baseUrl = apiConfig.getBaseUrl() + endpoint;

        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(baseUrl)
                .queryParam("source", apiRequest.getSource())
                .queryParam("destination", apiRequest.getDestination());


        // Optional: outbound dates
        if (apiRequest.getOutboundDepartmentDateStart() != null) {
            builder.queryParam("outboundDepartmentDateStart", apiRequest.getOutboundDepartmentDateStart());
        }
        // Optional: inbound dates (only for round trip)
        if (tripType == TripType.ROUND_TRIP) {
            if (apiRequest.getInboundDepartureDateStart() != null) {
                builder.queryParam("inboundDepartureDateStart", apiRequest.getInboundDepartureDateStart());
            }
        }

        // Optional: passengers
        builder.queryParam("adults", apiRequest.getAdults());
        builder.queryParam("children", apiRequest.getChildren());
        builder.queryParam("infants", apiRequest.getInfants());

        // Optional: baggage
        builder.queryParam("handbags", apiRequest.getHandbags());
        builder.queryParam("holdbags", apiRequest.getHoldbags());

        // Optional: filters
        if (apiRequest.getCabinClass() != null) builder.queryParam("cabinClass", apiRequest.getCabinClass());
        if (apiRequest.getSortBy() != null) builder.queryParam("sortBy", apiRequest.getSortBy());
        if (apiRequest.getSortOrder() != null) builder.queryParam("sortOrder", apiRequest.getSortOrder());
        builder.queryParam("priceStart", apiRequest.getPriceStart());
        builder.queryParam("priceEnd", apiRequest.getPriceEnd());
        builder.queryParam("limit", apiRequest.getLimit());
        if (apiRequest.getCurrency() != null) builder.queryParam("currency", apiRequest.getCurrency());

        String fullUrl = builder.toUriString();

        log.info("Calling external flight API: {}", fullUrl);

        ResponseEntity<ExternalApiResponse> response = restTemplate.exchange(
                fullUrl, HttpMethod.GET, HttpEntity.EMPTY, ExternalApiResponse.class);

            log.info("API call successful. Status: {}", response.getStatusCode());
            return response.getBody();
    }
}