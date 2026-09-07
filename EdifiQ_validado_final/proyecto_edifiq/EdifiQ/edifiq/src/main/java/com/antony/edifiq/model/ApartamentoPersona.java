package com.antony.edifiq.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Entity
@Table(name="apartamento_persona")
@IdClass(ApartamentoPersonaId.class)
public class ApartamentoPersona {

    @Id @NotNull(message="El apartamento es obligatorio")
    @ManyToOne(fetch=FetchType.EAGER) @JoinColumn(name="id_apartamento",nullable=false)
    private Apartamento apartamento;

    @Id @NotNull(message="La persona es obligatoria")
    @ManyToOne(fetch=FetchType.EAGER) @JoinColumn(name="id_persona",nullable=false)
    private Persona persona;

    @NotNull(message="El tipo de residente es obligatorio")
    @ManyToOne(fetch=FetchType.EAGER) @JoinColumn(name="id_tipo_residente",nullable=false)
    private TipoResidente tipoResidente;

    @NotNull(message="La fecha de ingreso es obligatoria")
    @Column(name="fecha_ingreso",nullable=false)
    private LocalDate fechaIngreso;

    @Column(name="fecha_salida")
    private LocalDate fechaSalida;

    public Apartamento getApartamento(){return apartamento;} public void setApartamento(Apartamento v){apartamento=v;}
    public Persona getPersona(){return persona;} public void setPersona(Persona v){persona=v;}
    public TipoResidente getTipoResidente(){return tipoResidente;} public void setTipoResidente(TipoResidente v){tipoResidente=v;}
    public LocalDate getFechaIngreso(){return fechaIngreso;} public void setFechaIngreso(LocalDate v){fechaIngreso=v;}
    public LocalDate getFechaSalida(){return fechaSalida;} public void setFechaSalida(LocalDate v){fechaSalida=v;}
}
