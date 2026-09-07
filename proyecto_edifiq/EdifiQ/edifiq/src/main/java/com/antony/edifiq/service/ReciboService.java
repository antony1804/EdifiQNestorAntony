package com.antony.edifiq.service;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.antony.edifiq.model.Apartamento;
import com.antony.edifiq.model.EstadoRecibo;
import com.antony.edifiq.model.Recibo;
import com.antony.edifiq.model.TipoServicio;
import com.antony.edifiq.repository.ApartamentoRepository;
import com.antony.edifiq.repository.EstadoReciboRepository;
import com.antony.edifiq.repository.ReciboRepository;
import com.antony.edifiq.repository.TipoServicioRepository;

@Service
public class ReciboService {
	private final ReciboRepository repo;
	private final ApartamentoRepository aptRepo;
	private final TipoServicioRepository servicioRepo;
	private final EstadoReciboRepository estadoRepo;

	public ReciboService(
			ReciboRepository r,
			ApartamentoRepository a,
			TipoServicioRepository s,
			EstadoReciboRepository e) {
		repo = r;
		aptRepo = a;
		servicioRepo = s;
		estadoRepo = e;
	}

	public List<Recibo> listar() {
		return repo.findAll();
	}

	public List<Recibo> porApartamento(Long id) {
		return repo.findByApartamento_Id(id);
	}

	@Transactional
	public Recibo guardar(Recibo r) {
		validar(r);
		r.setApartamento(apt(r));
		r.setTipoServicio(servicio(r));
		r.setEstadoRecibo(estado(r));
		return repo.save(r);
	}

	@Transactional
	public Recibo actualizar(Long id, Recibo d) {
		Recibo r = repo.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Recibo no encontrado"));
		validar(d);
		r.setPeriodo(d.getPeriodo());
		r.setValor(d.getValor());
		r.setFechaEmision(d.getFechaEmision());
		r.setFechaVencimiento(d.getFechaVencimiento());
		r.setApartamento(apt(d));
		r.setTipoServicio(servicio(d));
		r.setEstadoRecibo(estado(d));
		return repo.save(r);
	}

	private void validar(Recibo r) {
		if (r.getApartamento() == null || r.getApartamento().getId() == null) {
			throw new IllegalArgumentException("El apartamento es obligatorio");
		}

		if (r.getTipoServicio() == null || r.getTipoServicio().getId() == null) {
			throw new IllegalArgumentException("El servicio es obligatorio");
		}

		if (r.getEstadoRecibo() == null || r.getEstadoRecibo().getId() == null) {
			throw new IllegalArgumentException("El estado es obligatorio");
		}

		if (r.getFechaEmision() != null
				&& r.getFechaVencimiento() != null
				&& r.getFechaVencimiento().isBefore(r.getFechaEmision())) {
			throw new IllegalArgumentException(
					"El vencimiento no puede ser anterior a la emisión");
		}
	}

	private Apartamento apt(Recibo r) {
		return aptRepo.findById(r.getApartamento().getId())
				.orElseThrow(() -> new IllegalArgumentException("Apartamento no encontrado"));
	}

	private TipoServicio servicio(Recibo r) {
		return servicioRepo.findById(r.getTipoServicio().getId())
				.orElseThrow(() -> new IllegalArgumentException(
						"Tipo de servicio no encontrado"));
	}

	private EstadoRecibo estado(Recibo r) {
		return estadoRepo.findById(r.getEstadoRecibo().getId())
				.orElseThrow(() -> new IllegalArgumentException(
						"Estado de recibo no encontrado"));
	}

	public void eliminar(Long id) {
		repo.deleteById(id);
	}
}
