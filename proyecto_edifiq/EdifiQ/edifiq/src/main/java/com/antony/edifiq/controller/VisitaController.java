package com.antony.edifiq.controller;
import java.util.List; import org.springframework.http.*; import org.springframework.web.bind.annotation.*;
import com.antony.edifiq.model.Visita; import com.antony.edifiq.service.VisitaService;
@RestController @RequestMapping("/api/visitas") @CrossOrigin(origins="*")
public class VisitaController {
 private final VisitaService service;
 public VisitaController(VisitaService s){service=s;}
 @GetMapping public List<Visita> listar(){return service.listar();}
 @GetMapping("/apartamento/{id}") public List<Visita> porApartamento(@PathVariable Long id){return service.porApartamento(id);}
 @PostMapping public ResponseEntity<?> crear(@RequestBody @jakarta.validation.Valid Visita v){return ResponseEntity.status(HttpStatus.CREATED).body(service.guardar(v));}
 @PutMapping("/{id}") public ResponseEntity<?> actualizar(@PathVariable Long id,@RequestBody @jakarta.validation.Valid Visita v){return ResponseEntity.ok(service.actualizar(id,v));}
 @PatchMapping("/{id}/autorizar") public ResponseEntity<?> autorizar(@PathVariable Long id){return ResponseEntity.ok(service.autorizar(id));}
 @DeleteMapping("/{id}") public ResponseEntity<Void> eliminar(@PathVariable Long id){service.eliminar(id);return ResponseEntity.noContent().build();}
 @PatchMapping("/{id}/finalizar") public ResponseEntity<?> finalizar(@PathVariable Long id){return ResponseEntity.ok(service.finalizar(id));}
}
