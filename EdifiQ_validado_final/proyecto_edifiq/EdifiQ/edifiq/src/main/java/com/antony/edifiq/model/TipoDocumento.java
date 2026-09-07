package com.antony.edifiq.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name="tipo_documento")
public class TipoDocumento {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id_tipo_documento") private Long id;

    @NotBlank(message="El nombre es obligatorio")
    @Size(min=2,max=50,message="El nombre debe tener entre 2 y 50 caracteres")
    @Pattern(regexp="^[\\p{L}\\p{N}]+(?:[ \\-][\\p{L}\\p{N}]+)*$",message="El nombre solo puede contener letras, números, espacios y guiones")
    private String nombre;

    @NotBlank(message="La abreviatura es obligatoria")
    @Size(min=1,max=10,message="La abreviatura debe tener entre 1 y 10 caracteres")
    @Pattern(regexp="^[A-Za-z0-9.-]+$",message="La abreviatura solo puede contener letras, números, puntos y guiones")
    private String abreviatura;

    public Long getId(){return id;} public void setId(Long v){id=v;}
    public String getNombre(){return nombre;} public void setNombre(String v){nombre=v;}
    public String getAbreviatura(){return abreviatura;} public void setAbreviatura(String v){abreviatura=v;}
}
