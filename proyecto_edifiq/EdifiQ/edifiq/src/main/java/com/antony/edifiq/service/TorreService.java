package com.antony.edifiq.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.antony.edifiq.model.Apartamento;
import com.antony.edifiq.model.Torre;
import com.antony.edifiq.model.TorreCreacionDTO;
import com.antony.edifiq.repository.ApartamentoRepository;
import com.antony.edifiq.repository.TorreRepository;

@Service
public class TorreService {
    private final TorreRepository torreRepo;
    private final ApartamentoRepository apartamentoRepo;

    public TorreService(TorreRepository torreRepo, ApartamentoRepository apartamentoRepo) {
        this.torreRepo = torreRepo;
        this.apartamentoRepo = apartamentoRepo;
    }

    public List<Torre> listar() {
        return torreRepo.findAll();
    }

    @Transactional
    public Torre crear(TorreCreacionDTO datos) {
        int pisos = datos.getPisos() == null ? 4 : datos.getPisos();
        int apartamentosPorPiso = datos.getApartamentosPorPiso() == null
                ? 5
                : datos.getApartamentosPorPiso();

        if (pisos < 1 || apartamentosPorPiso < 1) {
            throw new IllegalArgumentException("La torre debe tener pisos y apartamentos válidos");
        }
        if (torreRepo.findByNombreTorreIgnoreCase(datos.getNombreTorre().trim()).isPresent()) {
            throw new IllegalArgumentException("Ya existe una torre con ese nombre");
        }

        Torre torre = new Torre();
        torre.setNombreTorre(datos.getNombreTorre().trim());
        Torre torreGuardada = torreRepo.save(torre);

        for (int piso = 1; piso <= pisos; piso++) {
            for (int numero = 1; numero <= apartamentosPorPiso; numero++) {
                Apartamento apartamento = new Apartamento();
                apartamento.setNumeroApartamento(String.valueOf(piso * 100 + numero));
                apartamento.setPiso(piso);
                apartamento.setActivo(true);
                apartamento.setTorre(torreGuardada);
                apartamentoRepo.save(apartamento);
            }
        }

        return torreGuardada;
    }

    @Transactional
    public Torre actualizar(Long id, Torre datos) {
        Torre torre = torreRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Torre no encontrada"));
        torreRepo.findByNombreTorreIgnoreCase(datos.getNombreTorre().trim())
                .filter(otra -> !otra.getId().equals(id))
                .ifPresent(otra -> {
                    throw new IllegalArgumentException("Ya existe una torre con ese nombre");
                });
        torre.setNombreTorre(datos.getNombreTorre().trim());
        return torreRepo.save(torre);
    }

    public void eliminar(Long id) {
        if (!torreRepo.existsById(id)) {
            throw new IllegalArgumentException("Torre no encontrada");
        }
        torreRepo.deleteById(id);
    }
}
