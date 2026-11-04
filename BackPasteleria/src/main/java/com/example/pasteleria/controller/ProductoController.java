package com.example.pasteleria.controller;

import com.example.pasteleria.entity.Producto;
import com.example.pasteleria.service.ProductoService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
public class ProductoController {

	private final ProductoService servicio;

	/** Crea un producto. Si faltan datos o son inválidos, Spring responde 400. */
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public Producto crear(@Valid @RequestBody Producto producto) {
		return servicio.crear(producto);
	}

	/** Lista todos los productos. */
	@GetMapping
	public List<Producto> listar() {
		return servicio.listar();
	}

	/** Devuelve un producto por ID (404 si no existe). */
	@GetMapping("/{id}")
	public Producto buscar(@PathVariable Long id) {
		return servicio.buscar(id);
	}

	/** Edita un producto conservando su ID (404 si no existe, 400 si los datos son inválidos). */
	@PutMapping("/{id}")
	public Producto actualizar(@PathVariable Long id, @Valid @RequestBody Producto producto) {
		return servicio.actualizar(id, producto);
	}

	/** Elimina un producto (204 si se elimina, 404 si no existe). */
	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void eliminar(@PathVariable Long id) {
		servicio.eliminar(id);
	}
}
