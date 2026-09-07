package com.antony.edifiq.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.antony.edifiq.model.Persona;

public interface PersonaRepository extends JpaRepository<Persona, Long> {
    Optional<Persona> findByNumeroDocumento(String numeroDocumento);
    Optional<Persona> findByTipoDocumento_IdAndNumeroDocumento(Long idTipoDocumento, String numeroDocumento);
    boolean existsByCorreoIgnoreCase(String correo);
    boolean existsByTelefono(String telefono);
    boolean existsByCorreoIgnoreCaseAndIdNot(String correo, Long id);
    boolean existsByTelefonoAndIdNot(String telefono, Long id);
}
