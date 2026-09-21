package com.antony.edifiq.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.antony.edifiq.model.Apartamento;
import com.antony.edifiq.model.EstadoVisita;
import com.antony.edifiq.model.TipoDocumento;
import com.antony.edifiq.model.TipoVisita;
import com.antony.edifiq.model.Visita;
import com.antony.edifiq.repository.ApartamentoRepository;
import com.antony.edifiq.repository.EstadoVisitaRepository;
import com.antony.edifiq.repository.TipoDocumentoRepository;
import com.antony.edifiq.repository.TipoVisitaRepository;
import com.antony.edifiq.repository.VisitaRepository;

@Service
public class VisitaService {
	private static final String ESTADO_PENDIENTE = "Pendiente";
	private static final String ESTADO_AUTORIZADA = "Autorizada";
	private final VisitaRepository repo;
	private final ApartamentoRepository aptRepo;
	private final TipoVisitaRepository tipoRepo;
	private final TipoDocumentoRepository docRepo;
	private final EstadoVisitaRepository estadoRepo;

	public VisitaService(
			VisitaRepository r,
			ApartamentoRepository a,
			TipoVisitaRepository t,
			TipoDocumentoRepository d,
			EstadoVisitaRepository e) {
		repo = r;
		aptRepo = a;
		tipoRepo = t;
		docRepo = d;
		estadoRepo = e;
	}

	public List<Visita> listar() {
		return repo.findAll();
	}

	public List<Visita> porApartamento(Long id) {
		return repo.findByApartamento_Id(id);
	}

	@Transactional
	public Visita guardar(Visita v) {
		validar(v);
		v.setApartamento(apt(v));
		v.setTipoVisita(tipo(v));
		v.setTipoDocumento(doc(v));
		v.setEstadoVisita(estadoInicial(v));
		return repo.save(v);
	}

	@Transactional
	public Visita actualizar(Long id, Visita d) {
		Visita v = repo.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Visita no encontrada"));
		validar(d);
		v.setTipoVisita(tipo(d));
		v.setTipoDocumento(doc(d));
		v.setNombreVisitante(d.getNombreVisitante());
		v.setDocumentoVisitante(d.getDocumentoVisitante());
		v.setMotivoVisita(d.getMotivoVisita());
		v.setFechaIngreso(d.getFechaIngreso());
		v.setFechaSalida(d.getFechaSalida());
		v.setEstadoVisita(estado(d));
		v.setApartamento(apt(d));
		return repo.save(v);
	}

	@Transactional
	public Visita autorizar(Long id) {
		Visita visita = repo.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Visita no encontrada"));
		if (!ESTADO_PENDIENTE.equalsIgnoreCase(visita.getEstadoVisita().getNombre())) {
			throw new IllegalArgumentException("Solo se pueden autorizar visitas pendientes");
		}
		visita.setEstadoVisita(estadoPorNombre(ESTADO_AUTORIZADA));
		return repo.save(visita);
	}

	@Transactional
	public Visita finalizar(Long id) {
		Visita visita = repo.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Visita no encontrada"));
		if (visita.getFechaSalida() != null
				|| "Finalizada".equalsIgnoreCase(visita.getEstadoVisita().getNombre())) {
			throw new IllegalArgumentException("La visita ya fue finalizada");
		}
		visita.setFechaSalida(java.time.LocalDateTime.now());
		visita.setEstadoVisita(estadoPorNombre("Finalizada"));
		return repo.save(visita);
	}

	private void validar(Visita v) {
		if (v.getApartamento() == null || v.getApartamento().getId() == null) {
			throw new IllegalArgumentException("El apartamento es obligatorio");
		}

		if (v.getTipoVisita() == null || v.getTipoVisita().getId() == null) {
			throw new IllegalArgumentException("El tipo de visita es obligatorio");
		}

		if (v.getTipoDocumento() == null || v.getTipoDocumento().getId() == null) {
			throw new IllegalArgumentException("El tipo de documento es obligatorio");
		}

		if (v.getEstadoVisita() == null || v.getEstadoVisita().getId() == null) {
			throw new IllegalArgumentException("El estado es obligatorio");
		}

		if (v.getFechaIngreso() != null
				&& v.getFechaSalida() != null
				&& v.getFechaSalida().isBefore(v.getFechaIngreso())) {
			throw new IllegalArgumentException("La salida no puede ser anterior al ingreso");
		}
	}

	private Apartamento apt(Visita v) {
		return aptRepo.findById(v.getApartamento().getId())
				.orElseThrow(() -> new IllegalArgumentException("Apartamento no encontrado"));
	}

	private TipoVisita tipo(Visita v) {
		return tipoRepo.findById(v.getTipoVisita().getId())
				.orElseThrow(() -> new IllegalArgumentException("Tipo de visita no encontrado"));
	}

	private TipoDocumento doc(Visita v) {
		return docRepo.findById(v.getTipoDocumento().getId())
				.orElseThrow(() -> new IllegalArgumentException(
						"Tipo de documento no encontrado"));
	}

	private EstadoVisita estado(Visita v) {
		return estadoRepo.findById(v.getEstadoVisita().getId())
				.orElseThrow(() -> new IllegalArgumentException(
						"Estado de visita no encontrado"));
	}

	private EstadoVisita estadoInicial(Visita v) {
		String nombre = "RESIDENTE".equalsIgnoreCase(v.getOrigenRegistro())
				? ESTADO_AUTORIZADA
				: ESTADO_PENDIENTE;
		return estadoPorNombre(nombre);
	}

	private EstadoVisita estadoPorNombre(String nombre) {
		return estadoRepo.findAll().stream()
				.filter(estado -> nombre.equalsIgnoreCase(estado.getNombre()))
				.findFirst()
				.orElseGet(() -> {
					EstadoVisita nuevoEstado = new EstadoVisita();
					nuevoEstado.setNombre(nombre);
					return estadoRepo.save(nuevoEstado);
				});
	}

	public void eliminar(Long id) {
		repo.deleteById(id);
	}
}
