package com.antony.edifiq.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name="torre", uniqueConstraints=@UniqueConstraint(columnNames="nombre_torre"))
public class Torre {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) @Column(name="id_torre") private Long id;

    @NotBlank(message="El nombre de la torre es obligatorio")
    @Size(min=2,max=20,message="El nombre de la torre debe tener entre 2 y 20 caracteres")
    @Pattern(regexp="^[\\p{L}\\p{N}]+(?:[ \\-][\\p{L}\\p{N}]+)*$",message="El nombre de la torre solo puede contener letras, números, espacios y guiones")
    @Column(name="nombre_torre",nullable=false,length=20) private String nombreTorre;

    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public String getNombreTorre(){return nombreTorre;} public void setNombreTorre(String nombreTorre){this.nombreTorre=nombreTorre;}
}
