package com.example.pasteleria.controller;

import com.example.pasteleria.dto.LoginRespuesta;
import com.example.pasteleria.dto.LoginSolicitud;
import com.example.pasteleria.entity.Usuario;
import com.example.pasteleria.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** Rutas públicas: registro e inicio de sesión. */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

	private final UsuarioService servicio;

	/** Crea una cuenta de cliente (201). 400 si faltan datos, 409 si el correo ya existe. */
	@PostMapping("/registro")
	@ResponseStatus(HttpStatus.CREATED)
	public Usuario registrar(@Valid @RequestBody Usuario usuario) {
		return servicio.registrar(usuario);
	}

	/** Devuelve { token, usuario }. 401 si el correo o la contraseña no coinciden. */
	@PostMapping("/login")
	public LoginRespuesta login(@Valid @RequestBody LoginSolicitud solicitud) {
		return servicio.login(solicitud);
	}
}
