package com.antony.edifiq.model;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class EntregaPaqueteDTO {
    @NotNull(message = "La persona que recibe es obligatoria")
    private Long personaId;

    @NotNull(message = "La fecha y hora de entrega son obligatorias")
    private LocalDateTime fechaEntrega;

    private String observacion;

    public Long getPersonaId() { return personaId; }
    public void setPersonaId(Long personaId) { this.personaId = personaId; }
    public LocalDateTime getFechaEntrega() { return fechaEntrega; }
    public void setFechaEntrega(LocalDateTime fechaEntrega) { this.fechaEntrega = fechaEntrega; }
    public String getObservacion() { return observacion; }
    public void setObservacion(String observacion) { this.observacion = observacion; }
}