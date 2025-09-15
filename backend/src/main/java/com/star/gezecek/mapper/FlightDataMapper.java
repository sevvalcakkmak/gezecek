package com.star.gezecek.mapper;

import com.star.gezecek.dto.request.FlightSearchRequest;
import com.star.gezecek.dto.response.ExternalApiResponse;
import com.star.gezecek.dto.response.Itinerary;
import com.star.gezecek.model.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
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
        params.setTripType(String.valueOf(userRequest.getTripType()));
        if (userRequest.getOutboundDepartmentDateStart() != null) {
            params.setDepartureDate(LocalDateTime.parse(userRequest.getOutboundDepartmentDateStart()));
        }
        if (userRequest.getInboundDepartureDateStart() != null) {
            params.setReturnDate(LocalDateTime.parse(userRequest.getInboundDepartureDateStart()));
        }
        params.setCurrency(userRequest.getCurrency());
        params.setLocale(userRequest.getLocale());
        params.setAdults(userRequest.getAdults());
        params.setChildren(userRequest.getChildren());
        params.setInfants(userRequest.getInfants());
        params.setHandbags(userRequest.getHandbags());
        params.setHoldbags(userRequest.getHoldbags());
        params.setCabinClass(String.valueOf(userRequest.getCabinClass()));
        params.setSortBy(String.valueOf(userRequest.getSortBy()));
        params.setSortOrder(String.valueOf(userRequest.getSortOrder()));



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

            String url = itinerary.getBookingOptions()
                    .getEdges()
                    .get(0)
                    .getNode()
                    .getBookingUrl();

            // Önüne base URL ekle
            option.setBookingUrl("https://www.kiwi.com/" + url);
        }

        return option;
    }

    public FlightSegment mapToFlightSegment(String flightOptionId) {
        FlightSegment segment = new FlightSegment();
        segment.setId(UUID.randomUUID().toString());
        return segment;
    }
}