package com.antony.edifiq.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Entity @Table(name="visita")
public class Visita {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) @Column(name="id_visita") private Long id;

    @NotNull(message="El tipo de visita es obligatorio")
    @ManyToOne(fetch=FetchType.EAGER) @JoinColumn(name="id_tipo_visita",nullable=false) private TipoVisita tipoVisita;
    @NotNull(message="El tipo de documento es obligatorio")
    @ManyToOne(fetch=FetchType.EAGER) @JoinColumn(name="id_tipo_documento",nullable=false) private TipoDocumento tipoDocumento;

    @NotBlank(message="El nombre del visitante es obligatorio")
    @Size(min=2,max=100,message="El nombre debe tener entre 2 y 100 caracteres")
    @Pattern(regexp="^[\\p{L}]+(?:[ '\\-][\\p{L}]+)*$",message="El nombre del visitante solo puede contener letras, espacios, apóstrofes y guiones")
    @Column(name="nombre_visitante",nullable=false) private String nombreVisitante;

    @NotBlank(message="El documento del visitante es obligatorio")
    @Size(min=3,max=30,message="El documento debe tener entre 3 y 30 caracteres")
    @Pattern(regexp="^[A-Za-z0-9.-]+$",message="El documento solo puede contener letras, números, puntos y guiones")
    @Column(name="documento_visitante",nullable=false) private String documentoVisitante;

    @Size(max=150,message="El motivo no puede superar 150 caracteres")
    @Pattern(regexp="^[\\p{L}\\p{N} .,'()¿?¡!/#&-]*$",message="El motivo contiene caracteres no permitidos")
    @Column(name="motivo_visita") private String motivoVisita;

    @NotNull(message="La fecha de ingreso es obligatoria")
    @Column(name="fecha_ingreso",nullable=false) private LocalDateTime fechaIngreso;
    @Column(name="fecha_salida") private LocalDateTime fechaSalida;

    @NotNull(message="El estado de la visita es obligatorio")
    @ManyToOne(fetch=FetchType.EAGER) @JoinColumn(name="id_estado_visita",nullable=false) private EstadoVisita estadoVisita;
    @NotNull(message="El apartamento es obligatorio")
    @ManyToOne(fetch=FetchType.EAGER) @JoinColumn(name="id_apartamento",nullable=false) private Apartamento apartamento;

    @Column(name="fecha_creacion",updatable=false,insertable=false) private LocalDateTime fechaCreacion;
    @Column(name="fecha_actualizacion",insertable=false) private LocalDateTime fechaActualizacion;

    public Long getId(){return id;} public void setId(Long v){id=v;} public TipoVisita getTipoVisita(){return tipoVisita;} public void setTipoVisita(TipoVisita v){tipoVisita=v;}
    public TipoDocumento getTipoDocumento(){return tipoDocumento;} public void setTipoDocumento(TipoDocumento v){tipoDocumento=v;} public String getNombreVisitante(){return nombreVisitante;} public void setNombreVisitante(String v){nombreVisitante=v;}
    public String getDocumentoVisitante(){return documentoVisitante;} public void setDocumentoVisitante(String v){documentoVisitante=v;} public String getMotivoVisita(){return motivoVisita;} public void setMotivoVisita(String v){motivoVisita=v;}
    public LocalDateTime getFechaIngreso(){return fechaIngreso;} public void setFechaIngreso(LocalDateTime v){fechaIngreso=v;} public LocalDateTime getFechaSalida(){return fechaSalida;} public void setFechaSalida(LocalDateTime v){fechaSalida=v;}
    public EstadoVisita getEstadoVisita(){return estadoVisita;} public void setEstadoVisita(EstadoVisita v){estadoVisita=v;} public Apartamento getApartamento(){return apartamento;} public void setApartamento(Apartamento v){apartamento=v;}
    public LocalDateTime getFechaCreacion(){return fechaCreacion;} public LocalDateTime getFechaActualizacion(){return fechaActualizacion;}
}
