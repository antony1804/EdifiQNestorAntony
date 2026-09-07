package com.antony.edifiq.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import com.antony.edifiq.model.*;
import com.antony.edifiq.repository.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/apartamentos-personas")
@CrossOrigin(origins="*")
public class ApartamentoPersonaController {

    private final ApartamentoPersonaRepository repo;
    private final ApartamentoRepository aptRepo;
    private final PersonaRepository personaRepo;
    private final TipoResidenteRepository tipoRepo;

    public ApartamentoPersonaController(
            ApartamentoPersonaRepository r,
            ApartamentoRepository a,
            PersonaRepository p,
            TipoResidenteRepository t) {
        repo=r; aptRepo=a; personaRepo=p; tipoRepo=t;
    }

    @GetMapping
    public List<ApartamentoPersona> listar() { return repo.findAll(); }

    @GetMapping("/apartamento/{id}")
    public List<ApartamentoPersona> porApartamento(@PathVariable Long id) {
        return repo.findByApartamento_Id(id);
    }

    @GetMapping("/persona/{id}")
    public List<ApartamentoPersona> porPersona(@PathVariable Long id) {
        return repo.findByPersona_Id(id);
    }

    @PostMapping
    public ResponseEntity<ApartamentoPersona> crear(@RequestBody @Valid ApartamentoPersona d) {
        if (d.getApartamento() == null || d.getApartamento().getId() == null
                || d.getPersona() == null || d.getPersona().getId() == null
                || d.getTipoResidente() == null || d.getTipoResidente().getId() == null) {
            throw new IllegalArgumentException("Apartamento, persona y tipo de residente son obligatorios");
        }

        if (d.getFechaSalida() != null && d.getFechaSalida().isBefore(d.getFechaIngreso())) {
            throw new IllegalArgumentException("La fecha de salida no puede ser anterior a la fecha de ingreso.");
        }

        var key = new ApartamentoPersonaId(d.getApartamento().getId(), d.getPersona().getId());
        if (repo.existsById(key)) {
            throw new IllegalArgumentException("Esta relación ya está registrada.");
        }

        d.setApartamento(aptRepo.findById(d.getApartamento().getId())
                .orElseThrow(() -> new IllegalArgumentException("Apartamento no encontrado")));
        d.setPersona(personaRepo.findById(d.getPersona().getId())
                .orElseThrow(() -> new IllegalArgumentException("Persona no encontrada")));
        d.setTipoResidente(tipoRepo.findById(d.getTipoResidente().getId())
                .orElseThrow(() -> new IllegalArgumentException("Tipo de residente no encontrado")));

        return ResponseEntity.status(HttpStatus.CREATED).body(repo.save(d));
    }

    @DeleteMapping("/{idApartamento}/{idPersona}")
    public ResponseEntity<Void> eliminar(@PathVariable Long idApartamento, @PathVariable Long idPersona) {
        var key = new ApartamentoPersonaId(idApartamento, idPersona);
        if (!repo.existsById(key)) return ResponseEntity.notFound().build();
        repo.deleteById(key);
        return ResponseEntity.noContent().build();
    }
}
