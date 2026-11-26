package com.example.pasteleria.controller;

import com.example.pasteleria.dto.CambioEstado;
import com.example.pasteleria.dto.PedidoSolicitud;
import com.example.pasteleria.dto.ResumenVentas;
import com.example.pasteleria.entity.Pedido;
import com.example.pasteleria.service.PedidoService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/**
 * Pedidos. Crear es público (visitante o cliente con token); "mios" y ver uno requieren token;
 * el resto solo para administradores (ver SecurityConfig).
 */
@RestController
@RequestMapping("/api/pedidos")
@RequiredArgsConstructor
public class PedidoController {

	private final PedidoService servicio;

	/**
	 * Registra un pedido con pago aprobado (201). Si viene token, el pedido queda asociado a esa cuenta;
	 * si no, al correo informado. 400 si los datos o productos no son válidos.
	 */
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public Pedido crear(@Valid @RequestBody PedidoSolicitud solicitud, @AuthenticationPrincipal Jwt jwt) {
		return servicio.crear(solicitud, jwt == null ? null : jwt.getSubject());
	}

	/** Historial de la cuenta del token. */
	@GetMapping("/mios")
	@SecurityRequirement(name = "bearerAuth")
	public List<Pedido> mios(@AuthenticationPrincipal Jwt jwt) {
		return servicio.delCliente(jwt.getSubject());
	}

	/** Indicadores del panel de ventas. */
	@GetMapping("/resumen")
	@SecurityRequirement(name = "bearerAuth")
	public ResumenVentas resumen() {
		return servicio.resumen();
	}

	@GetMapping
	@SecurityRequirement(name = "bearerAuth")
	public List<Pedido> listar() {
		return servicio.listar();
	}

	/** Un pedido: lo puede ver el administrador o el dueño (403 si es de otra cuenta). */
	@GetMapping("/{id}")
	@SecurityRequirement(name = "bearerAuth")
	public Pedido buscar(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
		Pedido pedido = servicio.buscar(id);
		boolean esAdmin = "admin".equals(jwt.getClaimAsString("rol"));
		if (!esAdmin && !jwt.getSubject().equalsIgnoreCase(pedido.getCorreoCliente())) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No puedes ver este pedido.");
		}
		return pedido;
	}

	@PatchMapping("/{id}/estado")
	@SecurityRequirement(name = "bearerAuth")
	public Pedido cambiarEstado(@PathVariable Long id, @Valid @RequestBody CambioEstado cambio) {
		return servicio.cambiarEstado(id, cambio.estado());
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@SecurityRequirement(name = "bearerAuth")
	public void eliminar(@PathVariable Long id) {
		servicio.eliminar(id);
	}
}
