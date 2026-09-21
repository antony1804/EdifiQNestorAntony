package com.antony.edifiq.model;
import jakarta.validation.constraints.*;
public class ActualizarPerfilDTO {
 @NotBlank(message="La contraseña actual es obligatoria") private String passwordActual;
 @Size(min=6,message="La contraseña debe tener al menos 6 caracteres") private String passwordNueva;
 public String getPasswordActual(){return passwordActual;} public void setPasswordActual(String v){passwordActual=v;}
 public String getPasswordNueva(){return passwordNueva;} public void setPasswordNueva(String v){passwordNueva=v;}
}
