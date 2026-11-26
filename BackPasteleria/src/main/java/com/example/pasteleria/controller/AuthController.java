package com.example.pasteleria.controller;

import com.example.pasteleria.dto.LoginRespuesta;
import com.example.pasteleria.dto.LoginSolicitud;
import com.example.pasteleria.entity.Usuario;
import com.example.pasteleria.service.UsuarioService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** Registro, inicio de sesión y renovación del token. */
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

	/**
	 * Cambia un token vigente por uno nuevo: { token, usuario }.
	 * 401 si el token falta, venció, la cuenta ya no existe o se superó el máximo de días.
	 */
	@PostMapping("/renovar")
	@SecurityRequirement(name = "bearerAuth")
	public LoginRespuesta renovar(@AuthenticationPrincipal Jwt token) {
		return servicio.renovar(token);
	}
}
