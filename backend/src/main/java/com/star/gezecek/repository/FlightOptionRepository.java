package com.star.gezecek.repository;

import com.star.gezecek.model.FlightOption;
import org.springframework.data.annotation.QueryAnnotation;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

// FlightOptionRepository.java
@Repository
public interface FlightOptionRepository extends CrudRepository<FlightOption, String> {

    // Find all flight options for a specific search
    List<FlightOption> findBySearchId(String searchId);

    // Find flight options that expire after a certain time (for cleanup)
    List<FlightOption> findByExpiresAtAfter(LocalDateTime dateTime);

    // Find flight options that expire before a certain time (for cleanup)
    List<FlightOption> findByExpiresAtBefore(LocalDateTime dateTime);

    // Find flight options by price range
    List<FlightOption> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);

}