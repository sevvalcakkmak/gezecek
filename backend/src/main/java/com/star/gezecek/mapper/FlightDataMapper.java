package com.star.gezecek.mapper;

import com.star.gezecek.dto.request.FlightSearchRequest;
import com.star.gezecek.dto.response.ExternalApiResponse;
import com.star.gezecek.dto.response.Itinerary;
import com.star.gezecek.model.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class FlightDataMapper {

    public FlightSearchResult mapToSearchResult(ExternalApiResponse apiResponse,
                                                FlightSearchRequest userRequest,
                                                String searchId) {
        FlightSearchResult result = new FlightSearchResult();
        result.setSearchId(searchId);
        result.setTimestamp(LocalDateTime.now());
        result.setStatus("COMPLETED");

        // Map search parameters
        result.setSearchParams(mapToSearchParams(userRequest, searchId));

        // API yanıtındaki itinerary'leri FlightOption'a dönüştür
        List<FlightOption> flightOptions = new ArrayList<>();
        if (apiResponse != null && apiResponse.getItineraries() != null) {
            for (Itinerary itinerary : apiResponse.getItineraries()) {
                FlightOption option = mapToFlightOption(itinerary, searchId);
                flightOptions.add(option);
            }
        }

        result.setFlightOptions(flightOptions);
        return result;
    }

    public FlightSearchParams mapToSearchParams(FlightSearchRequest userRequest, String searchId) {
        FlightSearchParams params = new FlightSearchParams();
        params.setOriginLocationId(userRequest.getSource());
        params.setDestinationLocationId(userRequest.getDestination());
        return params;
    }

    public FlightOption mapToFlightOption(Itinerary itinerary, String searchId) {
        FlightOption option = new FlightOption();
        option.setId(UUID.randomUUID().toString());

        // Price
        if (itinerary.getPrice() != null) {
            option.setPrice(itinerary.getPrice());
        }

        // Booking URL: check if edges exist
        if (itinerary.getBookingOptions() != null &&
                itinerary.getBookingOptions().getEdges() != null &&
                !itinerary.getBookingOptions().getEdges().isEmpty() &&
                itinerary.getBookingOptions().getEdges().get(0).getNode() != null) {

            option.setBookingUrl(itinerary.getBookingOptions()
                    .getEdges()
                    .get(0)
                    .getNode()
                    .getBookingUrl());
        }

        return option;
    }

    public FlightSegment mapToFlightSegment(String flightOptionId) {
        FlightSegment segment = new FlightSegment();
        segment.setId(UUID.randomUUID().toString());
        return segment;
    }
}