package com.star.gezecek.repository;

import com.star.gezecek.model.FlightSegment;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

// FlightSegmentRepository.java
@Repository
public interface FlightSegmentRepository extends CrudRepository<FlightSegment, String> {

    // Find all segments for a specific flight option
    List<FlightSegment> findByFlightOptionId(String flightOptionId);

    // Find segments by airline
    List<FlightSegment> findByCarrierCode(String carrierCode);

    // Find segments by origin airport
    List<FlightSegment> findByOriginAirportCode(String originAirportCode);

    // Find segments by destination airport
    List<FlightSegment> findByDestinationAirportCode(String destinationAirportCode);

    // Find segments departing after a certain time
    List<FlightSegment> findByDepartureTimeAfter(LocalDateTime departureTime);

    // Find segments by flight number
    List<FlightSegment> findByFlightNumber(String flightNumber);
}
