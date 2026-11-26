package com.example.pasteleria.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

/**
 * Lo que envía el front al confirmar una compra con pago aprobado.
 * Solo se envían IDs y cantidades: los precios los toma el servidor de la base de datos.
 */
public record PedidoSolicitud(
		@NotBlank(message = "El nombre es obligatorio.") String nombre,
		@NotBlank(message = "El correo es obligatorio.") @Email(message = "Introduce un correo válido.") String email,
		@NotBlank(message = "La dirección es obligatoria.") String direccion,
		@NotBlank(message = "La comuna es obligatoria.") String comuna,
		@NotBlank(message = "La región es obligatoria.") String region,
		@NotBlank(message = "Selecciona una opción de entrega.") String entrega,
		@NotEmpty(message = "Agrega productos al carrito antes de comprar.") List<@Valid Item> productos) {

	public record Item(
			@NotNull(message = "Falta el ID del producto.") Long id,
			@Min(value = 1, message = "La cantidad debe ser mayor que cero.") int cantidad) {
	}
}
