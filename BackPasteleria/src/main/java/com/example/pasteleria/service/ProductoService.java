package com.example.pasteleria.service;

import com.example.pasteleria.entity.Producto;
import com.example.pasteleria.repository.ProductoRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ProductoService {

	private final ProductoRepository repositorio;

	/** Guarda un producto nuevo. El ID siempre lo genera la base de datos. */
	@Transactional
	public Producto crear(Producto producto) {
		producto.setId(null);
		return repositorio.save(producto);
	}

	/** Devuelve todos los productos guardados. */
	@Transactional(readOnly = true)
	public List<Producto> listar() {
		return repositorio.findAll();
	}

	/** Busca un producto por ID. Responde 404 si no existe. */
	@Transactional(readOnly = true)
	public Producto buscar(Long id) {
		return repositorio.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado."));
	}

	/** Edita un producto conservando su ID. Responde 404 si no existe. */
	@Transactional
	public Producto actualizar(Long id, Producto datos) {
		Producto producto = buscar(id);
		producto.setTitulo(datos.getTitulo());
		producto.setDescripcion(datos.getDescripcion());
		producto.setImagen(datos.getImagen());
		producto.setCategoria(datos.getCategoria());
		producto.setPrecio(datos.getPrecio());
		producto.setDescuento(datos.getDescuento());
		return repositorio.save(producto);
	}

	/** Elimina un producto. Responde 404 si no existe. */
	@Transactional
	public void eliminar(Long id) {
		if (!repositorio.existsById(id)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado.");
		}
		repositorio.deleteById(id);
	}
}
