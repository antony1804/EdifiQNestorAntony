package com.antony.edifiq.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "persona")
public class Persona {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_persona")
    private Long id;

    @NotNull(message = "El tipo de documento es obligatorio")
    @ManyToOne
    @JoinColumn(name = "id_tipo_documento", nullable = false)
    private TipoDocumento tipoDocumento;

    @NotBlank(message = "El número de documento es obligatorio")
    @Size(min = 5, max = 20, message = "El documento debe tener entre 5 y 20 caracteres")
    @Pattern(regexp = "^[A-Za-z0-9.-]+$", message = "El documento solo puede contener letras, números, puntos y guiones")
    @Column(name = "numero_documento", nullable = false, length = 20)
    private String numeroDocumento;

    @NotBlank(message = "Los nombres son obligatorios")
    @Size(min = 2, max = 100, message = "Los nombres deben tener entre 2 y 100 caracteres")
    @Pattern(regexp = "^[\\p{L}]+(?:[ '\\-][\\p{L}]+)*$", message = "Los nombres solo pueden contener letras, espacios, apóstrofes y guiones")
    @Column(nullable = false, length = 100)
    private String nombres;

    @NotBlank(message = "Los apellidos son obligatorios")
    @Size(min = 2, max = 100, message = "Los apellidos deben tener entre 2 y 100 caracteres")
    @Pattern(regexp = "^[\\p{L}]+(?:[ '\\-][\\p{L}]+)*$", message = "Los apellidos solo pueden contener letras, espacios, apóstrofes y guiones")
    @Column(nullable = false, length = 100)
    private String apellidos;

    @Pattern(regexp = "^[0-9]{7,10}$", message = "El teléfono debe contener únicamente números y tener entre 7 y 10 dígitos")
    @Column(length = 20)
    private String telefono;

    @Email(message = "El correo no tiene un formato válido")
    @Size(max = 100, message = "El correo no puede superar 100 caracteres")
    @Pattern(regexp = "^\\S+$", message = "El correo no puede contener espacios")
    @Column(length = 100)
    private String correo;

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(name = "fecha_creacion", updatable = false, insertable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion", insertable = false)
    private LocalDateTime fechaActualizacion;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public TipoDocumento getTipoDocumento() { return tipoDocumento; }
    public void setTipoDocumento(TipoDocumento tipoDocumento) { this.tipoDocumento = tipoDocumento; }
    public String getNumeroDocumento() { return numeroDocumento; }
    public void setNumeroDocumento(String numeroDocumento) { this.numeroDocumento = numeroDocumento; }
    public String getNombres() { return nombres; }
    public void setNombres(String nombres) { this.nombres = nombres; }
    public String getApellidos() { return apellidos; }
    public void setApellidos(String apellidos) { this.apellidos = apellidos; }
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }
    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public LocalDateTime getFechaActualizacion() { return fechaActualizacion; }
}
