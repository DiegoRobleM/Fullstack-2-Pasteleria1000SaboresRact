package com.example.pasteleria.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Usuario {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank(message = "El nombre es obligatorio.")
	private String nombre;

	@NotBlank(message = "El apellido es obligatorio.")
	private String apellido;

	@NotBlank(message = "El correo es obligatorio.")
	@Email(message = "El correo debe ser válido.")
	@Column(unique = true)
	private String email;

	/** Se recibe en el JSON, pero nunca se devuelve. En la base se guarda cifrada con BCrypt. */
	@NotBlank(message = "La contraseña es obligatoria.")
	@Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres.")
	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	private String password;

	/** "admin" o "cliente". */
	private String rol;

	@NotBlank(message = "La dirección es obligatoria.")
	private String direccion;

	private String tipoPropiedad;

	@NotBlank(message = "La región es obligatoria.")
	private String region;

	@NotBlank(message = "La comuna es obligatoria.")
	private String comuna;
}
