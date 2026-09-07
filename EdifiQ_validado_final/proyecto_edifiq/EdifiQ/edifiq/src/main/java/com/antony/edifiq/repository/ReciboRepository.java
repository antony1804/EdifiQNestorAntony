package com.antony.edifiq.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.antony.edifiq.model.Recibo;

public interface ReciboRepository extends JpaRepository<Recibo, Long> {
    List<Recibo> findByApartamento_Id(Long idApartamento);
    List<Recibo> findByEstadoRecibo_Id(Long idEstado);
    boolean existsByApartamento_IdAndTipoServicio_IdAndPeriodoIgnoreCase(Long idApartamento, Long idTipoServicio, String periodo);
    boolean existsByApartamento_IdAndTipoServicio_IdAndPeriodoIgnoreCaseAndIdNot(Long idApartamento, Long idTipoServicio, String periodo, Long id);
}
