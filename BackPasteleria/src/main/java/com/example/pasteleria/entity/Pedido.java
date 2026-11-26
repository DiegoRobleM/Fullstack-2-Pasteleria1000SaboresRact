package com.example.pasteleria.entity;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Pedido con pago aprobado. Todos los montos los calcula el servidor. */
@Entity
@Getter
@Setter
@NoArgsConstructor
public class Pedido {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private Instant fecha;

	/** "confirmado", "en preparación", "despachado", "entregado" o "cancelado". */
	private String estado;

	/** Correo de la cuenta que compró, o el informado por el visitante. Se usa para el historial. */
	private String correoCliente;

	// Datos de entrega
	private String nombre;
	private String email;
	private String direccion;
	private String comuna;
	private String region;

	/** "domicilio" o "retiro". */
	private String entrega;
	private String entregaNombre;
	private int costoEntrega;

	@ElementCollection(fetch = FetchType.EAGER)
	@CollectionTable(name = "detalle_pedido", joinColumns = @JoinColumn(name = "pedido_id"))
	private List<DetallePedido> productos = new ArrayList<>();

	private int subtotal;
	private int total;
}
