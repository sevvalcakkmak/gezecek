package com.star.gezecek.mapper;

import com.star.gezecek.dto.request.FlightSearchRequest;
import com.star.gezecek.dto.response.*;
import com.star.gezecek.dto.response.Carrier;
import com.star.gezecek.model.*;
import com.star.gezecek.model.enums.CabinClass;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class FlightDataMapper {

    public FlightSearchResult mapToSearchResult(ExternalApiResponse apiResponse,
                                                FlightSearchRequest userRequest,
                                                String searchId) {
        FlightSearchResult result = new FlightSearchResult();
        result.setSearchId(searchId);
        result.setTimestamp(LocalDateTime.now());
        result.setTotalResults(apiResponse.getItineraries().size());
        result.setStatus("COMPLETED");

        // Map search parameters
        result.setSearchParams(mapToSearchParams(userRequest, searchId));

        // API yanıtındaki itinerary'leri FlightOption'a dönüştür
        List<FlightOption> flightOptions = new ArrayList<>();
        if (apiResponse != null && apiResponse.getItineraries() != null) {
            for (Itinerary itinerary : apiResponse.getItineraries()) {
                FlightOption option = mapToFlightOption(itinerary, searchId, userRequest.getCurrency());
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

    public FlightOption mapToFlightOption(Itinerary itinerary, String searchId, String currency) {
        return FlightOption.builder()
                .id(UUID.randomUUID().toString())
                .price(extractPrice(itinerary, currency))
                .bookingUrl(extractBookingUrl(itinerary))
                .providerName(extractProviderName(itinerary))
                .carrier(extractMarketingCarrier(itinerary))
                .operatingCarrier(extractOperatingCarrier(itinerary))
                .departure(extractDepartureInfo(itinerary))
                .arrival(extractArrivalInfo(itinerary))
                .duration(extractDuration(itinerary))
                .baggageInfo(extractBaggageInfo(itinerary))
                .cabinClass(extractCabinClass(itinerary))
                .searchId(searchId)
                .build();
    }

    private CarrierInfo extractMarketingCarrier(Itinerary itinerary) {
        if (itinerary.getSector() == null ||
                itinerary.getSector().getSectorSegments() == null ||
                itinerary.getSector().getSectorSegments().isEmpty()) {
            return null;
        }

        SectorSegment segment = itinerary.getSector().getSectorSegments().get(0);
        Carrier carrier = segment.getSegment().getCarrier();

        if (carrier == null) {
            return null;
        }

        return CarrierInfo.builder()
                .code(carrier.getCode())
                .name(carrier.getName())
                .logo("https://r-xx.bstatic.com/data/airlines_logo/" + carrier.getCode() +".png")
                .build();
    }
    private CarrierInfo extractOperatingCarrier(Itinerary itinerary) {
        if (itinerary.getSector() == null ||
                itinerary.getSector().getSectorSegments() == null ||
                itinerary.getSector().getSectorSegments().isEmpty()) {
            return null;
        }

        SectorSegment segment = itinerary.getSector().getSectorSegments().get(0);
        Carrier operatingCarrier = segment.getSegment().getOperatingCarrier();


        return CarrierInfo.builder()
                .code(operatingCarrier.getCode())
                .name(operatingCarrier.getName())
                .logo("https://r-xx.bstatic.com/data/airlines_logo/" + operatingCarrier.getCode() +".png")
                .build();
    }

    private Airport extractDepartureInfo(Itinerary itinerary) {
        if (itinerary.getSector() == null ||
                itinerary.getSector().getSectorSegments() == null ||
                itinerary.getSector().getSectorSegments().isEmpty()) {
            return null;
        }

        SectorSegment segment = itinerary.getSector().getSectorSegments().get(0);
        TimeInfo source = segment.getSegment().getSource();

        return Airport.builder()
                .code(source.getStation().getCode())
                .name(source.getStation().getName())
                .cityName(source.getStation().getCity().getName())
                .countryCode(source.getStation().getCountry().getCode())
                .coordinates(extractCoordinates(source.getStation().getGps()))
                .localTime(source.getLocalTime())
                .utcTime(source.getUtcTime())
                .build();
    }

    private Airport extractArrivalInfo(Itinerary itinerary) {
        if (itinerary.getSector() == null ||
                itinerary.getSector().getSectorSegments() == null ||
                itinerary.getSector().getSectorSegments().isEmpty()) {
            return null;
        }

        SectorSegment segment = itinerary.getSector().getSectorSegments().get(0);
        TimeInfo destination = segment.getSegment().getDestination();

        return Airport.builder()
                .code(destination.getStation().getCode())
                .name(destination.getStation().getName())
                .cityName(destination.getStation().getCity().getName())
                .countryCode(destination.getStation().getCountry().getCode())
                .coordinates(extractCoordinates(destination.getStation().getGps()))
                .localTime(destination.getLocalTime())
                .utcTime(destination.getUtcTime())
                .build();
    }



    private BaggageInfo extractBaggageInfo(Itinerary itinerary) {
        if (itinerary.getBagsInfo() == null) {
            return null;
        }

        BagsInfo bagsInfo = itinerary.getBagsInfo();

        return BaggageInfo.builder()
                .handBags(extractBagDetails(
                        bagsInfo.getIncludedHandBags(),
                        bagsInfo.getHandBagTiers()
                ))
                .checkedBags(extractBagDetails(
                        bagsInfo.getIncludedCheckedBags(),
                        bagsInfo.getCheckedBagTiers()
                ))
                .build();
    }
    private BagDetails extractBagDetails(Integer includedBags, List<BagTier> bagTiers) {
        BagDetails details = new BagDetails();
        details.setIncluded(includedBags);
        details.setAdditionalTiers(extractBagTiers(bagTiers));
        return details;
    }

    private List<BagTierInfo> extractBagTiers(List<BagTier> bagTiers) {
        if (bagTiers == null || bagTiers.isEmpty()) {
            return Collections.emptyList();
        }

        return bagTiers.stream()
                .map(this::mapToBagTierInfo)
                .collect(Collectors.toList());
    }

    private BagTierInfo mapToBagTierInfo(BagTier bagTier) {
        if (bagTier == null ||
                bagTier.getTierPrice() == null ||
                bagTier.getBags() == null ||
                bagTier.getBags().isEmpty()) {
            return null;
        }

        // Bag sayısını al
        Integer quantity = bagTier.getBags() != null ? bagTier.getBags().size() : 1;

        // İlk bag'ın weight'i
        Integer weight = null;
        if (bagTier.getBags() != null && !bagTier.getBags().isEmpty()) {
            weight = bagTier.getBags().get(0).getWeight() != null ?
                    bagTier.getBags().get(0).getWeight().getValue() : null;
        }

        return BagTierInfo.builder()
                .price(bagTier.getTierPrice().getAmount())
                .weight(weight)
                .quantity(quantity)
                .build();
    }

    // Mevcut helper metodları (bazıları artık kullanılmayacak)
    private FlightPrice extractPrice(Itinerary itinerary, String currency) {
        if (itinerary.getPrice() == null) {
            return null;
        }
        // API'den gelen price objesini al, currency'yi request'ten set et
        FlightPrice price = new FlightPrice();
        price.setAmount(itinerary.getPrice().getAmount());
        price.setCurrency(currency); // Request'ten gelen currency

        return price;
    }
    private CabinClass extractCabinClass(Itinerary itinerary){
        if (itinerary.getSector() == null ||
                itinerary.getSector().getSectorSegments() == null ||
                itinerary.getSector().getSectorSegments().isEmpty()) {
            return null;
        }


        SectorSegment segment = itinerary.getSector().getSectorSegments().get(0);
        return segment.getSegment().getCabinClass();
    }


    private String extractBookingUrl(Itinerary itinerary) {
        if (!hasValidBookingOptions(itinerary)) {
            return null;
        }

        BookingOptionNode firstOption = getFirstBookingOption(itinerary);
        String rawUrl = firstOption.getBookingUrl();

        return buildFullBookingUrl(rawUrl);
    }

    private boolean hasValidBookingOptions(Itinerary itinerary) {
        return itinerary.getBookingOptions() != null &&
                itinerary.getBookingOptions().getEdges() != null &&
                !itinerary.getBookingOptions().getEdges().isEmpty() &&
                itinerary.getBookingOptions().getEdges().get(0).getNode() != null;
    }

    private BookingOptionNode getFirstBookingOption(Itinerary itinerary) {
        return itinerary.getBookingOptions()
                .getEdges()
                .get(0)
                .getNode();
    }

    private String buildFullBookingUrl(String rawUrl) {
        if (rawUrl == null || rawUrl.trim().isEmpty()) {
            return null;
        }

        // Remove leading slash if present to avoid double slashes
        String cleanedUrl = rawUrl.startsWith("/") ? rawUrl.substring(1) : rawUrl;
        return "https://www.kiwi.com/" + cleanedUrl;
    }

    private String extractProviderName(Itinerary itinerary) {
        return itinerary.getProvider() != null ? itinerary.getProvider().getName() : null;
    }

    private String extractCarrierName(Itinerary itinerary) {
        if (itinerary.getSector() != null &&
                !itinerary.getSector().getSectorSegments().isEmpty()) {
            SectorSegment segment = itinerary.getSector().getSectorSegments().get(0);
            return segment.getSegment().getCarrier().getName();
        }
        return null;
    }

    private Integer extractDuration(Itinerary itinerary) {
        return itinerary.getSector() != null ? itinerary.getSector().getDuration() : null;
    }

    private Map<String, Double> extractCoordinates(Gps gps) {
        if (gps == null) {
            return null;
        }

        Map<String, Double> coordinates = new HashMap<>();
        coordinates.put("lat", gps.getLat());
        coordinates.put("lng", gps.getLng());
        return coordinates;
    }
    public FlightSegment mapToFlightSegment(String flightOptionId) {
        FlightSegment segment = new FlightSegment();
        segment.setId(UUID.randomUUID().toString());
        return segment;
    }
}