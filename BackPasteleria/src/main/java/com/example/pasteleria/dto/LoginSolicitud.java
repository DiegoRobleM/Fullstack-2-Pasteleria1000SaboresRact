package com.example.pasteleria.dto;

import jakarta.validation.constraints.NotBlank;

/** Lo que envía el front para iniciar sesión. */
public record LoginSolicitud(
		@NotBlank(message = "El correo es obligatorio.") String email,
		@NotBlank(message = "La contraseña es obligatoria.") String password) {
}
