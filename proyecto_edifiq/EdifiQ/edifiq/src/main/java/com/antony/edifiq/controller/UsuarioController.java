package com.antony.edifiq.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.antony.edifiq.model.EstadoUsuario;
import com.antony.edifiq.model.Persona;
import com.antony.edifiq.model.Rol;
import com.antony.edifiq.model.Usuario;
import com.antony.edifiq.model.UsuarioRegistroDTO;
import com.antony.edifiq.repository.EstadoUsuarioRepository;
import com.antony.edifiq.repository.PersonaRepository;
import com.antony.edifiq.repository.RolRepository;
import com.antony.edifiq.repository.UsuarioRepository;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(
    origins = {"http://localhost:5173", "http://localhost:5174"},
    methods = {
        org.springframework.web.bind.annotation.RequestMethod.GET,
        org.springframework.web.bind.annotation.RequestMethod.POST,
        org.springframework.web.bind.annotation.RequestMethod.PUT,
        org.springframework.web.bind.annotation.RequestMethod.DELETE,
        org.springframework.web.bind.annotation.RequestMethod.OPTIONS
    }
)
public class UsuarioController {

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

    // Registro administrativo
    @PostMapping
    public ResponseEntity<?> registrar(@RequestBody @jakarta.validation.Valid Usuario u) {

        if (u.getPersona() == null || u.getPersona().getId() == null) {
            return ResponseEntity.badRequest().body("La persona es obligatoria");
        }
        if (u.getRol() == null || u.getRol().getId() == null) {
            return ResponseEntity.badRequest().body("El rol es obligatorio");
        }
        if (repo.findByUsername(u.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("El nombre de usuario ya existe");
        }

        Persona persona = personaRepo.findById(u.getPersona().getId())
                .orElseThrow(() -> new RuntimeException("Persona no encontrada"));

        Rol rol = rolRepo.findById(u.getRol().getId())
                .orElseThrow(() ->
                        new RuntimeException("Rol no encontrado"));

        EstadoUsuario estado = estadoRepo.findById(1L)
                .orElseThrow(() ->
                        new RuntimeException("Estado no encontrado"));

        u.setPersona(persona);
        u.setRol(rol);
        u.setEstadoUsuario(estado);

        return ResponseEntity.ok(repo.save(u));
    }

    // Registro público de residentes
    @PostMapping("/registro-residente")
    public ResponseEntity<?> registrarResidente(
            @RequestBody @jakarta.validation.Valid UsuarioRegistroDTO dto) {

        // Verificar que la persona exista
        Persona persona = personaRepo.findById(dto.getIdPersona())
                .orElseThrow(() ->
                        new RuntimeException("Persona no encontrada"));

        if (repo.findByUsername(dto.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("El nombre de usuario ya existe");
        }

        // Verificar que la persona no tenga otro usuario
        if (repo.existsByPersona_Id(dto.getIdPersona())) {
            return ResponseEntity.badRequest()
                    .body("Esta persona ya tiene un usuario registrado");
        }

        // Buscar el rol residente
        Rol rolResidente = rolRepo
                .findByNombreIgnoreCase("residente")
                .orElseThrow(() ->
                        new RuntimeException(
                                "Rol 'residente' no configurado"));

        // Buscar estado activo
        EstadoUsuario estado = estadoRepo.findById(1L)
                .orElseThrow(() ->
                        new RuntimeException("Estado no encontrado"));

        // Crear usuario
        Usuario usuario = new Usuario();

        usuario.setPersona(persona);
        usuario.setRol(rolResidente);
        usuario.setEstadoUsuario(estado);
        usuario.setUsername(dto.getUsername());
        usuario.setPassword(dto.getPassword());

        return ResponseEntity.ok(repo.save(usuario));
    }

    // Login
    @PostMapping("/login")
    public ResponseEntity<Usuario> login(
            @RequestBody Usuario credenciales) {

        return repo.findByUsernameAndPassword(
                credenciales.getUsername(),
                credenciales.getPassword()
        )
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.status(401).build());
    }
}