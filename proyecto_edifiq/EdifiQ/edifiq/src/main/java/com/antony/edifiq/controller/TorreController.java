package com.antony.edifiq.controller;
import java.util.List;
import org.springframework.http.*; import org.springframework.web.bind.annotation.*;
import com.antony.edifiq.model.Torre; import com.antony.edifiq.model.TorreCreacionDTO; import com.antony.edifiq.service.TorreService;
@RestController @RequestMapping("/api/torres") @CrossOrigin(origins="*")
public class TorreController {
 private final TorreService service; public TorreController(TorreService service){this.service=service;}
 @GetMapping public List<Torre> listar(){return service.listar();}
 @PostMapping public ResponseEntity<?> crear(@RequestBody @jakarta.validation.Valid TorreCreacionDTO datos){return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(datos));}
 @PutMapping("/{id}") public ResponseEntity<?> actualizar(@PathVariable Long id,@RequestBody @jakarta.validation.Valid Torre d){return ResponseEntity.ok(service.actualizar(id,d));}
 @DeleteMapping("/{id}") public ResponseEntity<Void> eliminar(@PathVariable Long id){service.eliminar(id);return ResponseEntity.noContent().build();}
}
