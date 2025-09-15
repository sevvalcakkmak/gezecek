package com.star.gezecek.service;

import com.star.gezecek.client.FlightApiClient;
import com.star.gezecek.dto.request.ExternalSearchRequest;
import com.star.gezecek.dto.response.ExternalApiResponse;
import com.star.gezecek.exception.SearchResultNotFoundException;
import com.star.gezecek.mapper.FlightDataMapper;
import com.star.gezecek.model.FlightOption;
import com.star.gezecek.dto.request.FlightSearchRequest;
import com.star.gezecek.model.FlightSearchResult;
import com.star.gezecek.model.FlightSegment;
import com.star.gezecek.model.enums.CabinClass;
import com.star.gezecek.model.enums.SortBy;
import com.star.gezecek.model.enums.SortOrder;
import com.star.gezecek.model.enums.TripType;
import com.star.gezecek.repository.FlightOptionRepository;
import com.star.gezecek.repository.FlightSearchResultRepository;
import com.star.gezecek.repository.FlightSegmentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestClientException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class FlightSearchService {

    private final FlightApiClient flightApiClient;
    private final FlightDataMapper flightDataMapper;
    private final FlightSearchResultRepository searchResultRepository;
    private final FlightOptionRepository flightOptionRepository;
    private final FlightSegmentRepository flightSegmentRepository;

    public FlightSearchService(FlightApiClient flightApiClient,
                               FlightDataMapper flightDataMapper,
                               FlightSearchResultRepository searchResultRepository,
                               FlightOptionRepository flightOptionRepository,
                               FlightSegmentRepository flightSegmentRepository) {
        this.flightApiClient = flightApiClient;
        this.flightDataMapper = flightDataMapper;
        this.searchResultRepository = searchResultRepository;
        this.flightOptionRepository = flightOptionRepository;
        this.flightSegmentRepository = flightSegmentRepository;
    }

    public FlightSearchResult searchFlights(FlightSearchRequest userRequest) {
        String searchId = UUID.randomUUID().toString();
        log.info("Starting flight search with ID: {}", searchId);

        try {

            // Convert user request to external API format
            ExternalSearchRequest apiRequest = convertToApiRequest(userRequest);

            // Call external API
            ExternalApiResponse apiResponse = flightApiClient.searchFlights(apiRequest, userRequest.getTripType());

            // Map API response to our domain models
            FlightSearchResult result = processApiResponse(apiResponse, userRequest, searchId);

            log.info("Flight search completed successfully. Search ID: {}", searchId);
            return result;

        } catch (HttpClientErrorException | HttpServerErrorException ex) {
            log.error("Flight API error. Status: {}, Body: {}",
                    ex.getStatusCode(),
                    ex.getResponseBodyAsString(), ex);
            throw ex;
        }
        catch (RestClientException ex) {
            log.error("RestClientException: {}", ex.getMessage(), ex);
            throw ex;
        }
    }

    private ExternalSearchRequest convertToApiRequest(FlightSearchRequest userRequest) {
        ExternalSearchRequest apiRequest = new ExternalSearchRequest();

        apiRequest.setSource(userRequest.getSource());
        apiRequest.setDestination(userRequest.getDestination());
        apiRequest.setInboundDepartureDateStart(userRequest.getInboundDepartureDateStart());
        apiRequest.setOutboundDepartmentDateStart(userRequest.getOutboundDepartmentDateStart());

        // Trip type → locale mapping
        if (userRequest.getTripType() == TripType.ROUND_TRIP) {
            apiRequest.setLocale("roundtrip");
        } else {
            apiRequest.setLocale(null);
        }

        // Optional / default mapping
        apiRequest.setLocale(userRequest.getLocale() != null ? userRequest.getCurrency() : "eur");
        apiRequest.setCurrency(userRequest.getCurrency() != null ? userRequest.getCurrency() : "en");
        apiRequest.setAdults(userRequest.getAdults() != null ? userRequest.getAdults() : 1);
        apiRequest.setChildren(userRequest.getChildren() != null ? userRequest.getChildren() : 0);
        apiRequest.setInfants(userRequest.getInfants() != null ? userRequest.getInfants() : 0);
        apiRequest.setHandbags(userRequest.getHandbags() != null ? userRequest.getHandbags() : 1);
        apiRequest.setHoldbags(userRequest.getHoldbags() != null ? userRequest.getHoldbags() : 0);
        apiRequest.setCabinClass(userRequest.getCabinClass() != null ? userRequest.getCabinClass() : CabinClass.ECONOMY);
        apiRequest.setSortBy(userRequest.getSortBy() != null ? userRequest.getSortBy() : SortBy.QUALITY);
        apiRequest.setSortOrder(userRequest.getSortOrder() != null ? userRequest.getSortOrder() : SortOrder.ASCENDING);
        apiRequest.setPriceStart(userRequest.getPriceStart() != null ? userRequest.getPriceStart() : 0);
        apiRequest.setPriceEnd(userRequest.getPriceEnd() != null ? userRequest.getPriceEnd() : 2000);
        apiRequest.setLimit(userRequest.getLimit() != null ? userRequest.getLimit() : 10);

        return apiRequest;
    }


    private FlightSearchResult processApiResponse(ExternalApiResponse apiResponse,
                                                  FlightSearchRequest userRequest,
                                                  String searchId) {
        // Create main search result
        FlightSearchResult result = flightDataMapper.mapToSearchResult(apiResponse, userRequest, searchId);
        return searchResultRepository.save(result);
    }

    private FlightSearchResult createFailedResult(String searchId, String errorMessage) {
        FlightSearchResult result = new FlightSearchResult();
        result.setSearchId(searchId);
        result.setTimestamp(LocalDateTime.now());
        result.setStatus("FAILED");
        result.setErrorMessage(errorMessage);

        return searchResultRepository.save(result);
    }

    // Other methods for retrieving data
    public FlightSearchResult getSearchResult(String searchId) {
        return (FlightSearchResult) searchResultRepository.findById(searchId)
                .orElseThrow(() -> new SearchResultNotFoundException("Search result not found: " + searchId));
    }

    public List<FlightOption> getFlightOptions(String searchId) {
        return flightOptionRepository.findBySearchId(searchId);
    }

    public List<FlightSegment> getFlightSegments(String flightOptionId) {
        return flightSegmentRepository.findByFlightOptionId(flightOptionId);
    }
}