package com.example.pasteleria.service;

import com.example.pasteleria.dto.PedidoSolicitud;
import com.example.pasteleria.dto.ResumenVentas;
import com.example.pasteleria.entity.DetallePedido;
import com.example.pasteleria.entity.Pedido;
import com.example.pasteleria.entity.Producto;
import com.example.pasteleria.repository.PedidoRepository;
import com.example.pasteleria.repository.ProductoRepository;
import java.time.Instant;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class PedidoService {

	public static final Set<String> ESTADOS =
			Set.of("confirmado", "en preparación", "despachado", "entregado", "cancelado");

	/** Mismas opciones que el front (services/pedidos.js). */
	private static final Map<String, Entrega> ENTREGAS = Map.of(
			"domicilio", new Entrega("Despacho a domicilio", 3000),
			"retiro", new Entrega("Retiro en tienda", 0));

	private record Entrega(String nombre, int costo) {
	}

	private final PedidoRepository repositorio;
	private final ProductoRepository productos;

	/** Igual que precioFinal() del front: precio con descuento, redondeado al peso. */
	public static int precioFinal(int precio, int descuento) {
		int d = Math.min(100, Math.max(0, descuento));
		return (int) Math.round(precio * (1 - d / 100.0));
	}

	/**
	 * Crea un pedido con pago aprobado. Los precios se leen de la base de datos, no del cliente.
	 * 400 si un producto no existe o la entrega no es válida.
	 */
	@Transactional
	public Pedido crear(PedidoSolicitud solicitud, String correoCuenta) {
		Entrega entrega = ENTREGAS.get(solicitud.entrega());
		if (entrega == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Selecciona una opción de entrega válida.");
		}

		// Junta cantidades si el mismo producto viene repetido.
		Map<Long, Integer> cantidades = new LinkedHashMap<>();
		for (PedidoSolicitud.Item item : solicitud.productos()) {
			cantidades.merge(item.id(), item.cantidad(), Math::addExact);
		}

		Pedido pedido = new Pedido();
		int subtotal = 0;
		for (Map.Entry<Long, Integer> entrada : cantidades.entrySet()) {
			Producto producto = productos.findById(entrada.getKey())
					.orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
							"Hay productos no disponibles. Revisa tu carrito."));
			DetallePedido detalle = new DetallePedido();
			detalle.setProductoId(producto.getId());
			detalle.setTitulo(producto.getTitulo());
			detalle.setImagen(producto.getImagen());
			detalle.setCategoria(producto.getCategoria());
			detalle.setPrecio(producto.getPrecio());
			detalle.setDescuento(producto.getDescuento());
			detalle.setPrecioFinal(precioFinal(producto.getPrecio(), producto.getDescuento()));
			detalle.setCantidad(entrada.getValue());
			pedido.getProductos().add(detalle);
			subtotal = Math.addExact(subtotal, Math.multiplyExact(detalle.getPrecioFinal(), detalle.getCantidad()));
		}

		String email = solicitud.email().trim().toLowerCase();
		pedido.setFecha(Instant.now());
		pedido.setEstado("confirmado");
		pedido.setCorreoCliente(correoCuenta != null ? correoCuenta.toLowerCase() : email);
		pedido.setNombre(solicitud.nombre().trim());
		pedido.setEmail(email);
		pedido.setDireccion(solicitud.direccion().trim());
		pedido.setComuna(solicitud.comuna().trim());
		pedido.setRegion(solicitud.region().trim());
		pedido.setEntrega(solicitud.entrega());
		pedido.setEntregaNombre(entrega.nombre());
		pedido.setCostoEntrega(entrega.costo());
		pedido.setSubtotal(subtotal);
		pedido.setTotal(subtotal + entrega.costo());
		return repositorio.save(pedido);
	}

	/** Todos los pedidos, el más reciente primero. */
	@Transactional(readOnly = true)
	public List<Pedido> listar() {
		return repositorio.findAllByOrderByFechaDesc();
	}

	/** Historial de una cuenta. */
	@Transactional(readOnly = true)
	public List<Pedido> delCliente(String correo) {
		return repositorio.findByCorreoClienteOrderByFechaDesc(correo.toLowerCase());
	}

	@Transactional(readOnly = true)
	public Pedido buscar(Long id) {
		return repositorio.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido no encontrado."));
	}

	/** Cambia el estado. 400 si el estado no es válido, 404 si no existe. */
	@Transactional
	public Pedido cambiarEstado(Long id, String estado) {
		if (!ESTADOS.contains(estado)) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Estado de pedido inválido.");
		}
		Pedido pedido = buscar(id);
		pedido.setEstado(estado);
		return repositorio.save(pedido);
	}

	@Transactional
	public void eliminar(Long id) {
		if (!repositorio.existsById(id)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido no encontrado.");
		}
		repositorio.deleteById(id);
	}

	/**
	 * Panel de ventas (RF-15). Excluye pedidos cancelados. Ticket promedio = ingresos / pedidos,
	 * redondeado al peso; sin pedidos todo vale cero.
	 */
	@Transactional(readOnly = true)
	public ResumenVentas resumen() {
		List<Pedido> validos = listar().stream().filter(p -> !"cancelado".equals(p.getEstado())).toList();
		long ingresos = validos.stream().mapToLong(Pedido::getTotal).sum();
		int unidades = 0;
		Map<Long, ResumenVentas.ProductoVendido> porProducto = new LinkedHashMap<>();
		for (Pedido pedido : validos) {
			for (DetallePedido d : pedido.getProductos()) {
				unidades += d.getCantidad();
				long monto = (long) d.getPrecioFinal() * d.getCantidad();
				porProducto.merge(d.getProductoId(),
						new ResumenVentas.ProductoVendido(d.getProductoId(), d.getTitulo(), d.getCantidad(), monto),
						(a, b) -> new ResumenVentas.ProductoVendido(a.productoId(), a.titulo(),
								a.unidades() + b.unidades(), a.ingresos() + b.ingresos()));
			}
		}
		List<ResumenVentas.ProductoVendido> ranking = porProducto.values().stream()
				.sorted(Comparator.comparingInt(ResumenVentas.ProductoVendido::unidades).reversed()
						.thenComparing(Comparator.comparingLong(ResumenVentas.ProductoVendido::ingresos).reversed()))
				.toList();
		long ticket = validos.isEmpty() ? 0 : Math.round((double) ingresos / validos.size());
		return new ResumenVentas(ingresos, validos.size(), ticket, unidades, ranking,
				validos.stream().limit(5).toList());
	}
}
