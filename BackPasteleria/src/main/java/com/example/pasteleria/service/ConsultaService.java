package com.example.pasteleria.service;

import com.example.pasteleria.entity.Consulta;
import com.example.pasteleria.repository.ConsultaRepository;
import java.time.Instant;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ConsultaService {

	public static final Set<String> ESTADOS = Set.of("pendiente", "en revisión", "resuelta");

	private final ConsultaRepository repositorio;

	/** Guarda una consulta nueva como "pendiente". ID y fecha los asigna el servidor. */
	@Transactional
	public Consulta crear(Consulta consulta) {
		consulta.setId(null);
		consulta.setCorreo(consulta.getCorreo().trim().toLowerCase());
		consulta.setMensaje(consulta.getMensaje().trim());
		consulta.setNombre(consulta.getNombre() == null ? "" : consulta.getNombre().trim());
		consulta.setFecha(Instant.now());
		consulta.setEstado("pendiente");
		return repositorio.save(consulta);
	}

	/** Todas las consultas, la más reciente primero. */
	@Transactional(readOnly = true)
	public List<Consulta> listar() {
		return repositorio.findAllByOrderByFechaDesc();
	}

	@Transactional(readOnly = true)
	public Consulta buscar(Long id) {
		return repositorio.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Consulta no encontrada."));
	}

	/** Cambia el estado. 400 si el estado no es válido, 404 si no existe. */
	@Transactional
	public Consulta cambiarEstado(Long id, String estado) {
		if (!ESTADOS.contains(estado)) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Estado de consulta inválido.");
		}
		Consulta consulta = buscar(id);
		consulta.setEstado(estado);
		return repositorio.save(consulta);
	}

	@Transactional
	public void eliminar(Long id) {
		if (!repositorio.existsById(id)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Consulta no encontrada.");
		}
		repositorio.deleteById(id);
	}
}
