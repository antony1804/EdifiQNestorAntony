package com.antony.edifiq.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "persona") // ojo: en el script la tabla se llama "persona", no "personas"
public class Persona {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_persona")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_tipo_documento", nullable = false)
    private TipoDocumento tipoDocumento;

    @NotBlank(message = "El número de documento es obligatorio")
    @Pattern(regexp = "\\d+", message = "El documento solo puede contener números")
    @Size(min = 6, max = 20, message = "El documento debe tener entre 6 y 20 dígitos")
    @Column(name = "numero_documento", nullable = false, length = 20)
    private String numeroDocumento;

    @NotBlank(message = "Los nombres son obligatorios")
    @Pattern(regexp = "[A-Za-zÁÉÍÓÚÜáéíóúüÑñ\\s'-]+", message = "Los nombres solo pueden contener letras")
    @Size(max = 100, message = "Los nombres no pueden superar 100 caracteres")
    @Column(nullable = false, length = 100)
    private String nombres;

    @NotBlank(message = "Los apellidos son obligatorios")
    @Pattern(regexp = "[A-Za-zÁÉÍÓÚÜáéíóúüÑñ\\s'-]+", message = "Los apellidos solo pueden contener letras")
    @Size(max = 100, message = "Los apellidos no pueden superar 100 caracteres")
    @Column(nullable = false, length = 100)
    private String apellidos;

    @Pattern(regexp = "^$|\\d{7,20}", message = "El teléfono debe tener entre 7 y 20 dígitos")
    @Size(max = 20, message = "El teléfono no puede superar 20 caracteres")
    @Column(length = 20)
    private String telefono;

    @Email(message = "El correo no tiene un formato válido")
    @Size(max = 100, message = "El correo no puede superar 100 caracteres")
    @Column(length = 100)
    private String correo;

    private Boolean activo = true;

    @Column(name = "fecha_creacion", updatable = false, insertable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion", insertable = false)
    private LocalDateTime fechaActualizacion;

    // Getters y Setters
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