package com.example.pasteleria.dto;

import com.example.pasteleria.entity.Pedido;
import java.util.List;

/** Indicadores del panel de ventas del administrador. */
public record ResumenVentas(
		long ingresos,
		int pedidos,
		long ticketPromedio,
		int unidadesVendidas,
		List<ProductoVendido> ranking,
		List<Pedido> ultimasVentas) {

	public record ProductoVendido(Long productoId, String titulo, int unidades, long ingresos) {
	}
}
