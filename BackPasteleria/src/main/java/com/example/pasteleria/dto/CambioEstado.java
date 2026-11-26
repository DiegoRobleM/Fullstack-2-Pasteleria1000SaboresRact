package com.example.pasteleria.dto;

import jakarta.validation.constraints.NotBlank;

/** Cuerpo de PATCH .../estado: { "estado": "resuelta" }. */
public record CambioEstado(@NotBlank(message = "El estado es obligatorio.") String estado) {
}
