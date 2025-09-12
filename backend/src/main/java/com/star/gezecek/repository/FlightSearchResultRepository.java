package com.star.gezecek.repository;

import com.star.gezecek.model.FlightSearchResult;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

// FlightSearchResultRepository.java
@Repository
public interface FlightSearchResultRepository extends CrudRepository<FlightSearchResult, String> {

    // Find search results after a certain timestamp
    List<FlightSearchResult> findByTimestampAfter(LocalDateTime timestamp);

    // Find search results before a certain timestamp (for cleanup)
    List<FlightSearchResult> findByTimestampBefore(LocalDateTime timestamp);

    // Find search results by status
    List<FlightSearchResult> findByStatus(String status);

}