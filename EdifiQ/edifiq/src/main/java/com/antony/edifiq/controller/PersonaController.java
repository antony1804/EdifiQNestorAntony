package com.antony.edifiq.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.antony.edifiq.model.Persona;
import com.antony.edifiq.model.TipoDocumento;
import com.antony.edifiq.repository.PersonaRepository;
import com.antony.edifiq.repository.TipoDocumentoRepository;

@RestController
@RequestMapping("/api/personas")
@CrossOrigin(origins = "http://localhost:5174")
public class PersonaController {

    @Autowired
    private PersonaRepository repo;

    @Autowired
    private TipoDocumentoRepository tipoDocumentoRepo;

    @GetMapping
    public List<Persona> listar() {
        return repo.findAll();
    }

    @PostMapping
    public ResponseEntity<Persona> crear(@RequestBody Persona p) {
        // Aseguramos que el tipoDocumento venga completo desde la BD, no solo con el id
        TipoDocumento tipoDoc = tipoDocumentoRepo.findById(p.getTipoDocumento().getId())
                .orElseThrow(() -> new RuntimeException("Tipo de documento no encontrado"));
        p.setTipoDocumento(tipoDoc);
        return ResponseEntity.ok(repo.save(p));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Persona> actualizar(@PathVariable Long id, @RequestBody Persona datos) {
        return repo.findById(id).map(p -> {
            TipoDocumento tipoDoc = tipoDocumentoRepo.findById(datos.getTipoDocumento().getId())
                    .orElseThrow(() -> new RuntimeException("Tipo de documento no encontrado"));
            p.setTipoDocumento(tipoDoc);
            p.setNumeroDocumento(datos.getNumeroDocumento());
            p.setNombres(datos.getNombres());
            p.setApellidos(datos.getApellidos());
            p.setCorreo(datos.getCorreo());
            p.setTelefono(datos.getTelefono());
            p.setActivo(datos.getActivo());
            return ResponseEntity.ok(repo.save(p));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}