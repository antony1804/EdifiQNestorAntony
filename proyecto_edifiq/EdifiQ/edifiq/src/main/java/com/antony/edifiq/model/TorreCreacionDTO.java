package com.antony.edifiq.model;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class TorreCreacionDTO {
    @NotBlank(message = "El nombre de la torre es obligatorio")
    @Size(max = 20, message = "El nombre de la torre no puede superar 20 caracteres")
    private String nombreTorre;

    @Min(value = 1, message = "La torre debe tener al menos un piso")
    private Integer pisos = 4;

    @Min(value = 1, message = "Debe existir al menos un apartamento por piso")
    private Integer apartamentosPorPiso = 5;

    public String getNombreTorre() {
        return nombreTorre;
    }

    public void setNombreTorre(String nombreTorre) {
        this.nombreTorre = nombreTorre;
    }

    public Integer getPisos() {
        return pisos;
    }

    public void setPisos(Integer pisos) {
        this.pisos = pisos;
    }

    public Integer getApartamentosPorPiso() {
        return apartamentosPorPiso;
    }

    public void setApartamentosPorPiso(Integer apartamentosPorPiso) {
        this.apartamentosPorPiso = apartamentosPorPiso;
    }
}
