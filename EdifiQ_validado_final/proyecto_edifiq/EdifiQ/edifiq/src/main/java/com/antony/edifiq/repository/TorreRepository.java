package com.antony.edifiq.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.antony.edifiq.model.Torre;

public interface TorreRepository extends JpaRepository<Torre, Long> {
    boolean existsByNombreTorreIgnoreCase(String nombreTorre);
    boolean existsByNombreTorreIgnoreCaseAndIdNot(String nombreTorre, Long id);
    Optional<Torre> findByNombreTorreIgnoreCase(String nombreTorre);
}
