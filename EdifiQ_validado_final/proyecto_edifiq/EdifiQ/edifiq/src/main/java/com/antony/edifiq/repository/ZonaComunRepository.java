package com.antony.edifiq.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.antony.edifiq.model.ZonaComun;

public interface ZonaComunRepository extends JpaRepository<ZonaComun, Long> {
    boolean existsByNombreIgnoreCase(String nombre);
    boolean existsByNombreIgnoreCaseAndIdNot(String nombre, Long id);
}
