package com.antony.edifiq.controller;

import java.util.List;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import com.antony.edifiq.model.Persona;
import com.antony.edifiq.repository.PersonaRepository;
import com.antony.edifiq.repository.TipoDocumentoRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/personas")
@CrossOrigin(origins = "*")
public class PersonaController {

    private static final String DUPLICADO =
            "Uno o más datos personales ya están registrados. Verifica la información e inténtalo nuevamente.";

    private final PersonaRepository repo;
    private final TipoDocumentoRepository tipoRepo;

    public PersonaController(PersonaRepository repo, TipoDocumentoRepository tipoRepo) {
        this.repo = repo;
        this.tipoRepo = tipoRepo;
    }

    @GetMapping
    public List<Persona> listar() {
        return repo.findAll();
    }

    @PostMapping
    public ResponseEntity<Persona> crear(@RequestBody @Valid Persona p) {
        normalizar(p);

        if (repo.findByTipoDocumento_IdAndNumeroDocumento(
                p.getTipoDocumento().getId(), p.getNumeroDocumento()).isPresent()
                || (p.getCorreo() != null && repo.existsByCorreoIgnoreCase(p.getCorreo()))
                || (p.getTelefono() != null && repo.existsByTelefono(p.getTelefono()))) {
            throw new IllegalArgumentException(DUPLICADO);
        }

        p.setTipoDocumento(tipoRepo.findById(p.getTipoDocumento().getId())
                .orElseThrow(() -> new IllegalArgumentException("Tipo de documento no encontrado")));

        return ResponseEntity.status(HttpStatus.CREATED).body(repo.save(p));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Persona> actualizar(
            @PathVariable Long id,
            @RequestBody @Valid Persona datos) {

        normalizar(datos);

        return repo.findById(id).map(p -> {
            if (repo.findByTipoDocumento_IdAndNumeroDocumento(
                    datos.getTipoDocumento().getId(), datos.getNumeroDocumento())
                    .filter(x -> !x.getId().equals(id)).isPresent()
                    || (datos.getCorreo() != null
                        && repo.existsByCorreoIgnoreCaseAndIdNot(datos.getCorreo(), id))
                    || (datos.getTelefono() != null
                        && repo.existsByTelefonoAndIdNot(datos.getTelefono(), id))) {
                throw new IllegalArgumentException(DUPLICADO);
            }

            p.setTipoDocumento(tipoRepo.findById(datos.getTipoDocumento().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Tipo de documento no encontrado")));
            p.setNumeroDocumento(datos.getNumeroDocumento());
            p.setNombres(datos.getNombres());
            p.setApellidos(datos.getApellidos());
            p.setCorreo(datos.getCorreo());
            p.setTelefono(datos.getTelefono());
            p.setActivo(datos.getActivo() == null || datos.getActivo());

            return ResponseEntity.ok(repo.save(p));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/documento/{numeroDocumento}")
    public ResponseEntity<Persona> buscarPorDocumento(@PathVariable String numeroDocumento) {
        return repo.findByNumeroDocumento(numeroDocumento.trim())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    private void normalizar(Persona p) {
        p.setNumeroDocumento(p.getNumeroDocumento().trim().toUpperCase());
        p.setNombres(normalizarNombre(p.getNombres()));
        p.setApellidos(normalizarNombre(p.getApellidos()));
        if (p.getTelefono() != null) {
            p.setTelefono(p.getTelefono().trim());
        }
        if (p.getCorreo() != null && !p.getCorreo().isBlank()) {
            p.setCorreo(p.getCorreo().trim().toLowerCase());
        } else {
            p.setCorreo(null);
        }
    }

    private String normalizarNombre(String value) {
        return value.trim().replaceAll("\\s+", " ").toUpperCase();
    }
}
