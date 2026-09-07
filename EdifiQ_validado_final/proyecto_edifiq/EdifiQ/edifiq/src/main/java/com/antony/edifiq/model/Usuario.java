package com.antony.edifiq.model;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "usuario")
public class Usuario {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long id;

    @NotBlank(message="El usuario es obligatorio")
    @Size(min=4,max=50,message="El usuario debe tener entre 4 y 50 caracteres")
    @Pattern(regexp="^[A-Za-z0-9._-]+$",message="El usuario solo puede contener letras, números, punto, guion y guion bajo")
    @Column(nullable=false,unique=true,length=50)
    private String username;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @NotBlank(message="La contraseña es obligatoria")
    @Size(min=6,max=72,message="La contraseña debe tener entre 6 y 72 caracteres")
    @Column(nullable=false)
    private String password;

    @NotNull(message="El estado del usuario es obligatorio")
    @ManyToOne @JoinColumn(name="id_estado_usuario",nullable=false)
    private EstadoUsuario estadoUsuario;

    @NotNull(message="La persona es obligatoria")
    @ManyToOne @JoinColumn(name="id_persona",nullable=false)
    private Persona persona;

    @NotNull(message="El rol es obligatorio")
    @ManyToOne @JoinColumn(name="id_rol",nullable=false)
    private Rol rol;

    @Column(name="fecha_creacion",updatable=false,insertable=false) private LocalDateTime fechaCreacion;
    @Column(name="fecha_actualizacion",insertable=false) private LocalDateTime fechaActualizacion;

    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public String getUsername(){return username;} public void setUsername(String username){this.username=username;}
    public String getPassword(){return password;} public void setPassword(String password){this.password=password;}
    public EstadoUsuario getEstadoUsuario(){return estadoUsuario;} public void setEstadoUsuario(EstadoUsuario v){estadoUsuario=v;}
    public Persona getPersona(){return persona;} public void setPersona(Persona v){persona=v;}
    public Rol getRol(){return rol;} public void setRol(Rol v){rol=v;}
    public LocalDateTime getFechaCreacion(){return fechaCreacion;} public LocalDateTime getFechaActualizacion(){return fechaActualizacion;}
}
