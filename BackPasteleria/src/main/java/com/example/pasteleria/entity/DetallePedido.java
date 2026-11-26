package com.example.pasteleria.entity;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Copia de un producto al momento de la compra. Si después se edita o elimina el producto,
 * el pedido conserva lo que se pagó.
 */
@Embeddable
@Getter
@Setter
@NoArgsConstructor
public class DetallePedido {

	private Long productoId;
	private String titulo;
	private String imagen;
	private String categoria;
	private int precio;
	private int descuento;
	private int precioFinal;
	private int cantidad;
}
