package com.antony.edifiq.controller;

import java.util.List;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import com.antony.edifiq.model.*;
import com.antony.edifiq.repository.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    private static final String DUPLICADO =
            "No fue posible completar el registro porque uno o más datos únicos ya están registrados.";

    private final UsuarioRepository repo;
    private final PersonaRepository personaRepo;
    private final RolRepository rolRepo;
    private final EstadoUsuarioRepository estadoRepo;

    public UsuarioController(
            UsuarioRepository repo,
            PersonaRepository personaRepo,
            RolRepository rolRepo,
            EstadoUsuarioRepository estadoRepo) {
        this.repo = repo;
        this.personaRepo = personaRepo;
        this.rolRepo = rolRepo;
        this.estadoRepo = estadoRepo;
    }

    @GetMapping
    public List<Usuario> listar() {
        return repo.findAll();
    }

    @PostMapping
    public ResponseEntity<Usuario> registrar(@RequestBody @Valid Usuario u) {
        normalizar(u);

        if (repo.existsByUsernameIgnoreCase(u.getUsername())
                || (u.getPersona() != null && u.getPersona().getId() != null
                    && repo.existsByPersona_Id(u.getPersona().getId()))) {
            throw new IllegalArgumentException(DUPLICADO);
        }

        Persona persona = personaRepo.findById(u.getPersona().getId())
                .orElseThrow(() -> new IllegalArgumentException("Persona no encontrada"));
        Rol rol = rolRepo.findById(u.getRol().getId())
                .orElseThrow(() -> new IllegalArgumentException("Rol no encontrado"));
        EstadoUsuario estado = estadoRepo.findById(1L)
                .orElseThrow(() -> new IllegalArgumentException("Estado activo no configurado"));

        u.setPersona(persona);
        u.setRol(rol);
        u.setEstadoUsuario(estado);

        return ResponseEntity.status(HttpStatus.CREATED).body(repo.save(u));
    }

    @PostMapping("/registro-residente")
    public ResponseEntity<Usuario> registrarResidente(
            @RequestBody @Valid UsuarioRegistroDTO dto) {

        dto.setUsername(dto.getUsername().trim());

        Persona persona = personaRepo.findById(dto.getIdPersona())
                .orElseThrow(() -> new IllegalArgumentException(
                        "No fue posible completar el registro con los datos proporcionados."));

        if (repo.existsByUsernameIgnoreCase(dto.getUsername())
                || repo.existsByPersona_Id(dto.getIdPersona())) {
            throw new IllegalArgumentException(DUPLICADO);
        }

        Rol rolResidente = rolRepo.findByNombreIgnoreCase("residente")
                .orElseThrow(() -> new IllegalArgumentException(
                        "Rol 'residente' no configurado"));

        EstadoUsuario estado = estadoRepo.findById(1L)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Estado activo no configurado"));

        Usuario usuario = new Usuario();
        usuario.setPersona(persona);
        usuario.setRol(rolResidente);
        usuario.setEstadoUsuario(estado);
        usuario.setUsername(dto.getUsername());
        usuario.setPassword(dto.getPassword());

        return ResponseEntity.status(HttpStatus.CREATED).body(repo.save(usuario));
    }

    @PostMapping("/login")
    public ResponseEntity<Usuario> login(@RequestBody Usuario credenciales) {
        return repo.findByUsernameAndPassword(
                credenciales.getUsername().trim(),
                credenciales.getPassword()
        ).map(ResponseEntity::ok).orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

    private void normalizar(Usuario u) {
        u.setUsername(u.getUsername().trim());
    }
}
