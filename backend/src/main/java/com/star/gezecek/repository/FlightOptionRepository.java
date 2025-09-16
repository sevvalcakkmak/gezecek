package com.star.gezecek.repository;

import com.star.gezecek.model.FlightOption;
import org.springframework.data.annotation.QueryAnnotation;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FlightOptionRepository extends CrudRepository<FlightOption, String> {

}