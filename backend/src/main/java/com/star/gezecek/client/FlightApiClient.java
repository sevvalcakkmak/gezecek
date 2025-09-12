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

        String fullUrl = UriComponentsBuilder.fromUriString(baseUrl)
                .queryParam("source", apiRequest.getSource())
                .queryParam("destination", apiRequest.getDestination())
                .toUriString();

        // Optional parametreleri ekle
            /*if (apiRequest.getDepartureDate() != null) {
                builder.queryParam("departureDate", apiRequest.getDepartureDate());
            }
            if (apiRequest.getReturnDate() != null && tripType == TripType.ROUND_TRIP) {
                builder.queryParam("returnDate", apiRequest.getReturnDate());
            }*/
           /* if (apiRequest.getAdults() != null) {
                builder.queryParam("adults", apiRequest.getAdults());
            }
            if (apiRequest.getChildren() != null) {
                builder.queryParam("children", apiRequest.getChildren());
            }
            if (apiRequest.getInfants() != null) {
                builder.queryParam("infants", apiRequest.getInfants());
            }
            if (apiRequest.getCabinClass() != null) {
                builder.queryParam("cabinClass", apiRequest.getCabinClass());
            }
            if (apiRequest.getMaxStops() != null) {
                builder.queryParam("maxStops", apiRequest.getMaxStops());
            }
 */

            log.info("Calling external flight API: {}", fullUrl);

        ResponseEntity<ExternalApiResponse> response = restTemplate.exchange(
                fullUrl, HttpMethod.GET, HttpEntity.EMPTY, ExternalApiResponse.class);

            log.info("API call successful. Status: {}", response.getStatusCode());
            return response.getBody();
    }
}