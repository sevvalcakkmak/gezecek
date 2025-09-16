package com.star.gezecek.repository;

import com.star.gezecek.model.FlightSearchResult;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FlightSearchResultRepository extends CrudRepository<FlightSearchResult, String> {

}