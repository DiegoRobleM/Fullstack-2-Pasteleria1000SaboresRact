package com.example.pasteleria.controller;

import com.example.pasteleria.entity.Usuario;
import com.example.pasteleria.service.UsuarioService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * Administración de usuarios. Solo con token de un administrador (ver SecurityConfig).
 * Los usuarios se crean con POST /api/auth/registro.
 */
@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class UsuarioController {

	private final UsuarioService servicio;

	@GetMapping
	public List<Usuario> listar() {
		return servicio.listar();
	}

	@GetMapping("/{id}")
	public Usuario buscar(@PathVariable Long id) {
		return servicio.buscar(id);
	}

	@PutMapping("/{id}")
	public Usuario actualizar(@PathVariable Long id, @Valid @RequestBody Usuario usuario) {
		return servicio.actualizar(id, usuario);
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void eliminar(@PathVariable Long id) {
		servicio.eliminar(id);
	}
}
