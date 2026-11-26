package com.example.pasteleria.config;

import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

/** Devuelve los errores como { "mensaje": "..." } para que el front los muestre tal cual. */
@RestControllerAdvice
public class ManejadorErrores {

	@ExceptionHandler(ResponseStatusException.class)
	public ResponseEntity<Map<String, String>> estado(ResponseStatusException error) {
		String mensaje = error.getReason() != null ? error.getReason() : "Error en la solicitud.";
		return ResponseEntity.status(error.getStatusCode()).body(Map.of("mensaje", mensaje));
	}

	/** Errores de @Valid: se devuelve el primer mensaje (por ejemplo "El correo es obligatorio."). */
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Map<String, String>> validacion(MethodArgumentNotValidException error) {
		String mensaje = error.getBindingResult().getAllErrors().stream()
				.map(e -> e.getDefaultMessage())
				.findFirst()
				.orElse("Datos inválidos.");
		return ResponseEntity.badRequest().body(Map.of("mensaje", mensaje));
	}

	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ResponseEntity<Map<String, String>> jsonInvalido(HttpMessageNotReadableException error) {
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("mensaje", "Datos inválidos."));
	}
}
