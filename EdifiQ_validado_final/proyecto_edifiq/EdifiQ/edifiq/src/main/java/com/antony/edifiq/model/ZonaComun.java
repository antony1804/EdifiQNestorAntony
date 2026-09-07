package com.antony.edifiq.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity @Table(name="zona_comun")
public class ZonaComun {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) @Column(name="id_zona") private Long id;

    @NotBlank(message="El nombre es obligatorio")
    @Size(min=2,max=50,message="El nombre debe tener entre 2 y 50 caracteres")
    @Pattern(regexp="^[\\p{L}\\p{N}]+(?:[ \\-][\\p{L}\\p{N}]+)*$",message="El nombre solo puede contener letras, números, espacios y guiones")
    private String nombre;

    @NotBlank(message="La descripción es obligatoria")
    @Size(min=3,max=200,message="La descripción debe tener entre 3 y 200 caracteres")
    @Pattern(regexp="^[\\p{L}\\p{N} .,'()¿?¡!/#&-]+$",message="La descripción contiene caracteres no permitidos")
    private String descripcion;

    public Long getId(){return id;} public void setId(Long v){id=v;}
    public String getNombre(){return nombre;} public void setNombre(String v){nombre=v;}
    public String getDescripcion(){return descripcion;} public void setDescripcion(String v){descripcion=v;}
}
