package com.antony.edifiq.controller;

import java.util.List;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import com.antony.edifiq.model.ZonaComun;
import com.antony.edifiq.repository.ZonaComunRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/zonas")
@CrossOrigin(origins="*")
public class ZonaComunController {
    private final ZonaComunRepository repo;

    public ZonaComunController(ZonaComunRepository repo) { this.repo = repo; }

    @GetMapping
    public List<ZonaComun> listar() { return repo.findAll(); }

    @PostMapping
    public ResponseEntity<ZonaComun> crear(@RequestBody @Valid ZonaComun z) {
        normalizar(z);
        if (repo.existsByNombreIgnoreCase(z.getNombre())) {
            throw new IllegalArgumentException("Ya existe una zona común con ese nombre.");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(repo.save(z));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ZonaComun> actualizar(@PathVariable Long id, @RequestBody @Valid ZonaComun datos) {
        normalizar(datos);
        return repo.findById(id).map(z -> {
            if (repo.existsByNombreIgnoreCaseAndIdNot(datos.getNombre(), id)) {
                throw new IllegalArgumentException("Ya existe una zona común con ese nombre.");
            }
            z.setNombre(datos.getNombre());
            z.setDescripcion(datos.getDescripcion());
            return ResponseEntity.ok(repo.save(z));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private void normalizar(ZonaComun z) {
        z.setNombre(z.getNombre().trim().replaceAll("\\s+", " "));
        z.setDescripcion(z.getDescripcion().trim().replaceAll("\\s+", " "));
    }
}
