package com.antony.edifiq.service;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.antony.edifiq.model.Apartamento;
import com.antony.edifiq.model.EstadoPaquete;
import com.antony.edifiq.model.Paquete;
import com.antony.edifiq.model.Persona;
import com.antony.edifiq.repository.ApartamentoPersonaRepository;
import com.antony.edifiq.repository.PersonaRepository;
import com.antony.edifiq.repository.ApartamentoRepository;
import com.antony.edifiq.repository.EstadoPaqueteRepository;
import com.antony.edifiq.repository.PaqueteRepository;

@Service
public class PaqueteService {
	private final PaqueteRepository repo;
	private final ApartamentoRepository aptRepo;
	private final EstadoPaqueteRepository estadoRepo;
	private final ApartamentoPersonaRepository apartamentoPersonaRepo;
	private final PersonaRepository personaRepo;

	public PaqueteService(
			PaqueteRepository r,
			ApartamentoRepository a,
			EstadoPaqueteRepository e,
			ApartamentoPersonaRepository apr,
			PersonaRepository pr) {
		repo = r;
		aptRepo = a;
		estadoRepo = e;
		apartamentoPersonaRepo = apr;
		personaRepo = pr;
	}

	public List<Paquete> listar() {
		return repo.findAll();
	}

	public List<Paquete> porApartamento(Long id) {
		return repo.findByApartamento_Id(id);
	}

	@Transactional
	public Paquete guardar(Paquete p) {
		validar(p);
		p.setApartamento(apt(p));
		p.setEstadoPaquete(estado(p));

		if (p.getFechaRecepcion() == null) {
			p.setFechaRecepcion(LocalDateTime.now());
		}

		return repo.save(p);
	}

	@Transactional
	public Paquete actualizar(Long id, Paquete d) {
		Paquete p = repo.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Paquete no encontrado"));
		validar(d);
		p.setDescripcion(d.getDescripcion());
		p.setRemitente(d.getRemitente());
		p.setFechaRecepcion(d.getFechaRecepcion());
		p.setFechaEntrega(d.getFechaEntrega());
		if (d.getPersonaEntrega() != null) {
			p.setPersonaEntrega(d.getPersonaEntrega());
		}
		if (d.getObservacionEntrega() != null) {
			p.setObservacionEntrega(d.getObservacionEntrega());
		}
		p.setApartamento(apt(d));
		p.setEstadoPaquete(estado(d));
		return repo.save(p);
	}

	@Transactional
	public Paquete entregar(Long id, Long personaId, LocalDateTime fechaEntrega, String observacion) {
		Paquete paquete = repo.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Paquete no encontrado"));
		if (!apartamentoPersonaRepo.existsByApartamento_IdAndPersona_Id(
				paquete.getApartamento().getId(), personaId)) {
			throw new IllegalArgumentException("La persona seleccionada no pertenece al apartamento del paquete");
		}
		Persona persona = personaRepo.findById(personaId)
				.orElseThrow(() -> new IllegalArgumentException("Persona no encontrada"));
		if (fechaEntrega.isBefore(paquete.getFechaRecepcion())) {
			throw new IllegalArgumentException("La entrega no puede ser anterior a la recepción");
		}
		EstadoPaquete entregado = estadoRepo.findAll().stream()
				.filter(e -> e.getNombre().equalsIgnoreCase("Entregado"))
				.findFirst().orElseThrow(() -> new IllegalArgumentException("Estado Entregado no configurado"));
		paquete.setEstadoPaquete(entregado);
		paquete.setFechaEntrega(fechaEntrega);
		paquete.setPersonaEntrega(persona);
		paquete.setObservacionEntrega(observacion == null || observacion.isBlank() ? null : observacion.trim());
		return repo.save(paquete);
	}

	private void validar(Paquete p) {
		if (p.getApartamento() == null || p.getApartamento().getId() == null) {
			throw new IllegalArgumentException("El apartamento es obligatorio");
		}

		if (p.getEstadoPaquete() == null || p.getEstadoPaquete().getId() == null) {
			throw new IllegalArgumentException("El estado es obligatorio");
		}

		if (p.getFechaEntrega() != null
				&& p.getFechaRecepcion() != null
				&& p.getFechaEntrega().isBefore(p.getFechaRecepcion())) {
			throw new IllegalArgumentException(
					"La entrega no puede ser anterior a la recepción");
		}
	}

	private Apartamento apt(Paquete p) {
		return aptRepo.findById(p.getApartamento().getId())
				.orElseThrow(() -> new IllegalArgumentException("Apartamento no encontrado"));
	}

	private EstadoPaquete estado(Paquete p) {
		return estadoRepo.findById(p.getEstadoPaquete().getId())
				.orElseThrow(() -> new IllegalArgumentException(
						"Estado de paquete no encontrado"));
	}

	public void eliminar(Long id) {
		repo.deleteById(id);
	}
}
