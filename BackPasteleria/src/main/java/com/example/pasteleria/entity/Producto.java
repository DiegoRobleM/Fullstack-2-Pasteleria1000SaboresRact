package com.example.pasteleria.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Producto {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank(message = "El nombre es obligatorio.")
	private String titulo;

	@NotBlank(message = "La descripción es obligatoria.")
	@Column(length = 1000)
	private String descripcion;

	@NotBlank(message = "La imagen es obligatoria.")
	private String imagen;

	@NotBlank(message = "La categoría es obligatoria.")
	private String categoria;

	@Positive(message = "El precio debe ser mayor que cero.")
	private int precio;

	@Min(value = 0, message = "El descuento debe estar entre 0 y 100.")
	@Max(value = 100, message = "El descuento debe estar entre 0 y 100.")
	private int descuento;
}
