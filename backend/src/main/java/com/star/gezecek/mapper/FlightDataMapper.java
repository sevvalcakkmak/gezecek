package com.star.gezecek.mapper;

import com.star.gezecek.dto.request.FlightSearchRequest;
import com.star.gezecek.dto.response.*;
import com.star.gezecek.dto.response.Carrier;
import com.star.gezecek.model.*;
import com.star.gezecek.model.enums.CabinClass;
import com.star.gezecek.model.enums.SegmentType;
import com.star.gezecek.model.enums.TripType;
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
        result.setTripType(userRequest.getTripType()); // Bu satırı ekleyin

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
        FlightOption.FlightOptionBuilder builder = FlightOption.builder()
                .id(UUID.randomUUID().toString())
                .tripType(itinerary.isRoundTrip() ? TripType.ROUND_TRIP : TripType.ONE_WAY)
                .isRoundTrip(itinerary.isRoundTrip())
                .price(extractPrice(itinerary, currency))
                .bookingUrl(extractBookingUrl(itinerary))
                .providerName(extractProviderName(itinerary))
                .baggageInfo(extractBaggageInfo(itinerary))
                .stopoverInfo(itinerary.isRoundTrip() ? extractStopoverInfo(itinerary) : null);

        List<FlightSegment> segments = new ArrayList<>();

        if (itinerary.isOneWay()) {
            Sector sector = itinerary.getSector();
            mapOutboundSectorToFlightOption(builder, sector);
            segments.addAll(createFlightSegments(sector, SegmentType.OUTBOUND));

        } else if (itinerary.isRoundTrip()) {
            mapOutboundSectorToFlightOption(builder, itinerary.getOutbound());
            mapInboundSectorToFlightOption(builder, itinerary.getInbound());

            segments.addAll(createFlightSegments(itinerary.getOutbound(), SegmentType.OUTBOUND));
            segments.addAll(createFlightSegments(itinerary.getInbound(), SegmentType.INBOUND));
        }

        builder.segments(segments);
        return builder.build();
    }



    private List<FlightSegment> createFlightSegments(Sector sector, SegmentType type) {
        if (sector == null || sector.getSectorSegments() == null ||
                sector.getSectorSegments().isEmpty()) {
            return Collections.emptyList();
        }

        List<FlightSegment> flightSegments = new ArrayList<>();

        for (SectorSegment sectorSegment : sector.getSectorSegments()) {
            Segment segment = sectorSegment.getSegment();
            TimeInfo source = segment.getSource();
            TimeInfo destination = segment.getDestination();

            // Operating carrier null kontrolü
            String operatingCarrierCode = null;
            if (segment.getOperatingCarrier() != null) {
                operatingCarrierCode = segment.getOperatingCarrier().getCode();
            } else {
                // Eğer operating carrier null ise, normal carrier'ı kullan
                operatingCarrierCode = segment.getCarrier().getCode();
            }

            FlightSegment flightSegment = FlightSegment.builder()
                    .id(UUID.randomUUID().toString())
                    .flightNumber(segment.getCode())
                    .carrierCode(segment.getCarrier().getCode())
                    .operatingCarrierCode(operatingCarrierCode)
                    .originAirportCode(source.getStation().getCode())
                    .destinationAirportCode(destination.getStation().getCode())
                    .departureTime(segment.getSource().getLocalTime())
                    .arrivalTime(segment.getDestination().getLocalTime())
                    .durationMinutes(sector.getDuration() != null ? sector.getDuration() / 60 : null)
                    .cabinClass(String.valueOf(segment.getCabinClass()))
                    .build();

            flightSegments.add(flightSegment);
        }

        return flightSegments;
    }

    private void mapOutboundSectorToFlightOption(FlightOption.FlightOptionBuilder builder, Sector sector) {
        if (sector == null || sector.getSectorSegments() == null ||
                sector.getSectorSegments().isEmpty()) {
            return;
        }

        SectorSegment firstSectorSegment = sector.getSectorSegments().get(0);
        Segment firstSegment = firstSectorSegment.getSegment();

        SectorSegment lastSectorSegment = sector.getSectorSegments().get(sector.getSectorSegments().size() -1);
        Segment lastSegment = lastSectorSegment.getSegment();

        // Outbound bilgilerini set et
        builder.carrier(extractCarrierInfo(firstSegment.getCarrier()))
                .stopCount(calculateStopCount(sector))
                .operatingCarrier(extractCarrierInfo(firstSegment.getOperatingCarrier()))
                .departure(extractAirportInfo(firstSegment.getSource()))
                .arrival(extractAirportInfo(lastSegment.getDestination()))
                .duration(sector.getDuration() / 60)
                .cabinClass(firstSegment.getCabinClass());
    }

    private void mapInboundSectorToFlightOption(FlightOption.FlightOptionBuilder builder, Sector sector) {
        if (sector == null || sector.getSectorSegments() == null ||
                sector.getSectorSegments().isEmpty()) {
            return;
        }

        SectorSegment firstSectorSegment = sector.getSectorSegments().get(0);
        Segment firstSegment = firstSectorSegment.getSegment();

        SectorSegment lastSectorSegment = sector.getSectorSegments().get(sector.getSectorSegments().size() -1);
        Segment lastSegment = lastSectorSegment.getSegment();

        // Inbound (return) bilgilerini set et
        builder.returnCarrier(extractCarrierInfo(firstSegment.getCarrier()))
                .returnStopCount(calculateStopCount(sector))
                .returnOperatingCarrier(extractCarrierInfo(firstSegment.getOperatingCarrier()))
                .returnDeparture(extractAirportInfo(firstSegment.getSource()))
                .returnArrival(extractAirportInfo(lastSegment.getDestination()))
                .returnDuration(sector.getDuration() / 60)
                .returnCabinClass(firstSegment.getCabinClass());
    }

    private Integer calculateStopCount(Sector sector) {
        return sector.getSectorSegments().size() - 1;
    }

    private Airport extractAirportInfo(TimeInfo timeInfo) {
        if (timeInfo == null || timeInfo.getStation() == null) return null;

        Station station = timeInfo.getStation();
        return Airport.builder()
                .code(station.getCode())
                .name(station.getName())
                .cityName(station.getCity() != null ? station.getCity().getName() : null)
                .countryCode(station.getCountry() != null ? station.getCountry().getCode() : null)
                .coordinates(extractCoordinates(station.getGps()))
                .localTime(timeInfo.getLocalTime())
                .utcTime(timeInfo.getUtcTime())
                .build();
    }

    private CarrierInfo extractCarrierInfo(Carrier carrier) {
        if (carrier == null) return null;

        return CarrierInfo.builder()
                .code(carrier.getCode())
                .name(carrier.getName())
                .logo("https://r-xx.bstatic.com/data/airlines_logo/" + carrier.getCode() + ".png")
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

    private FlightPrice extractPrice(Itinerary itinerary, String currency) {
        if (itinerary.getPrice() == null) {
            return null;
        }
        FlightPrice price = new FlightPrice();
        price.setAmount(itinerary.getPrice().getAmount());
        price.setCurrency(currency);

        return price;
    }


    private StopoverInfo extractStopoverInfo(Itinerary itinerary) {
        if (!itinerary.isRoundTrip() || itinerary.getStopover() == null) {
            return null;
        }

        Stopover stopover = itinerary.getStopover();
        return StopoverInfo.builder()
                .nightsCount(stopover.getNightsCount())
                .cityName(stopover.getArrival() != null && stopover.getArrival().getCity() != null ?
                        stopover.getArrival().getCity().getName() : null)
                .duration(stopover.getDuration())
                .build();
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


    private Map<String, Double> extractCoordinates(Gps gps) {
        if (gps == null) {
            return null;
        }

        Map<String, Double> coordinates = new HashMap<>();
        coordinates.put("lat", gps.getLat());
        coordinates.put("lng", gps.getLng());
        return coordinates;
    }
}