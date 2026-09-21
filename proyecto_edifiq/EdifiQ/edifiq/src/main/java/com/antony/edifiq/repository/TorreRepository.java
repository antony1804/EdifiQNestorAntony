package com.antony.edifiq.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import com.antony.edifiq.model.Torre;
public interface TorreRepository extends JpaRepository<Torre, Long> {
 Optional<Torre> findByNombreTorreIgnoreCase(String nombreTorre);
}
