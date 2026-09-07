package com.antony.edifiq.model;
import jakarta.persistence.*;
@Entity @Table(name="estado_paquete")
public class EstadoPaquete {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) @Column(name="id_estado_paquete") private Long id; private String nombre;
 public Long getId(){return id;} public void setId(Long v){id=v;} public String getNombre(){return nombre;} public void setNombre(String v){nombre=v;}
}
