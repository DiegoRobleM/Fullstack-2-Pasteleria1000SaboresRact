package com.example.pasteleria.controller;

import com.example.pasteleria.dto.CambioEstado;
import com.example.pasteleria.entity.Consulta;
import com.example.pasteleria.service.ConsultaService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** Consultas de contacto. Crear es público; el resto solo para administradores (ver SecurityConfig). */
@RestController
@RequestMapping("/api/consultas")
@RequiredArgsConstructor
public class ConsultaController {

	private final ConsultaService servicio;

	/** Envía una consulta (201). 400 si falta correo o mensaje. */
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public Consulta crear(@Valid @RequestBody Consulta consulta) {
		return servicio.crear(consulta);
	}

	@GetMapping
	@SecurityRequirement(name = "bearerAuth")
	public List<Consulta> listar() {
		return servicio.listar();
	}

	@GetMapping("/{id}")
	@SecurityRequirement(name = "bearerAuth")
	public Consulta buscar(@PathVariable Long id) {
		return servicio.buscar(id);
	}

	/** Cambia a "pendiente", "en revisión" o "resuelta". */
	@PatchMapping("/{id}/estado")
	@SecurityRequirement(name = "bearerAuth")
	public Consulta cambiarEstado(@PathVariable Long id, @Valid @RequestBody CambioEstado cambio) {
		return servicio.cambiarEstado(id, cambio.estado());
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@SecurityRequirement(name = "bearerAuth")
	public void eliminar(@PathVariable Long id) {
		servicio.eliminar(id);
	}
}
