package com.antony.edifiq.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name="rol")
public class Rol {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id_rol") private Long id;

    @NotBlank(message="El nombre es obligatorio")
    @Size(min=2,max=30,message="El nombre debe tener entre 2 y 30 caracteres")
    @Pattern(regexp="^[\\p{L}\\p{N}]+(?:[ \\-][\\p{L}\\p{N}]+)*$",message="El nombre solo puede contener letras, números, espacios y guiones")
    private String nombre;

    public Long getId(){return id;} public void setId(Long v){id=v;}
    public String getNombre(){return nombre;} public void setNombre(String v){nombre=v;}
    
}
