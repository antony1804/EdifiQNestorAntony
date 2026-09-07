package com.antony.edifiq.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Entity @Table(name="paquete")
public class Paquete {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) @Column(name="id_paquete") private Long id;

    @NotBlank(message="La descripción es obligatoria")
    @Size(min=3,max=200,message="La descripción debe tener entre 3 y 200 caracteres")
    @Pattern(regexp="^[\\p{L}\\p{N} .,'()/#-]+$",message="La descripción contiene caracteres no permitidos")
    private String descripcion;

    @NotBlank(message="El remitente es obligatorio")
    @Size(min=2,max=100,message="El remitente debe tener entre 2 y 100 caracteres")
    @Pattern(regexp="^[\\p{L}\\p{N} .,'()&/#-]+$",message="El remitente contiene caracteres no permitidos")
    private String remitente;

    @NotNull(message="La fecha de recepción es obligatoria")
    @Column(name="fecha_recepcion",nullable=false) private LocalDateTime fechaRecepcion;
    @Column(name="fecha_entrega") private LocalDateTime fechaEntrega;

    @NotNull(message="El estado del paquete es obligatorio")
    @ManyToOne(fetch=FetchType.EAGER) @JoinColumn(name="id_estado_paquete",nullable=false)
    private EstadoPaquete estadoPaquete;

    @NotNull(message="El apartamento es obligatorio")
    @ManyToOne(fetch=FetchType.EAGER) @JoinColumn(name="id_apartamento",nullable=false)
    private Apartamento apartamento;

    @Column(name="fecha_creacion",updatable=false,insertable=false) private LocalDateTime fechaCreacion;
    @Column(name="fecha_actualizacion",insertable=false) private LocalDateTime fechaActualizacion;

    public Long getId(){return id;} public void setId(Long v){id=v;}
    public String getDescripcion(){return descripcion;} public void setDescripcion(String v){descripcion=v;}
    public String getRemitente(){return remitente;} public void setRemitente(String v){remitente=v;}
    public LocalDateTime getFechaRecepcion(){return fechaRecepcion;} public void setFechaRecepcion(LocalDateTime v){fechaRecepcion=v;}
    public LocalDateTime getFechaEntrega(){return fechaEntrega;} public void setFechaEntrega(LocalDateTime v){fechaEntrega=v;}
    public EstadoPaquete getEstadoPaquete(){return estadoPaquete;} public void setEstadoPaquete(EstadoPaquete v){estadoPaquete=v;}
    public Apartamento getApartamento(){return apartamento;} public void setApartamento(Apartamento v){apartamento=v;}
    public LocalDateTime getFechaCreacion(){return fechaCreacion;} public LocalDateTime getFechaActualizacion(){return fechaActualizacion;}
}
