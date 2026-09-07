package com.antony.edifiq.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.antony.edifiq.model.EstadoUsuario;

public interface EstadoUsuarioRepository extends JpaRepository<EstadoUsuario, Long> {
}