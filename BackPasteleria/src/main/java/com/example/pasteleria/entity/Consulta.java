package com.example.pasteleria.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.Instant;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Mensaje enviado desde el formulario de contacto. */
@Entity
@Getter
@Setter
@NoArgsConstructor
public class Consulta {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	/** Opcional. */
	private String nombre;

	@NotBlank(message = "El correo es obligatorio.")
	@Email(message = "El correo debe ser válido.")
	private String correo;

	@NotBlank(message = "El mensaje es obligatorio.")
	@Column(length = 2000)
	private String mensaje;

	/** La asigna el servidor al crear la consulta. */
	private Instant fecha;

	/** "pendiente", "en revisión" o "resuelta". */
	private String estado;
}
