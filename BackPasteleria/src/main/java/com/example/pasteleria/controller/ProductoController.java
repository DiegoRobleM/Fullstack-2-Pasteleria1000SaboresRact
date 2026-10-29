package com.example.pasteleria.controller;

import com.example.pasteleria.entity.Producto;
import com.example.pasteleria.repository.ProductoRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
public class ProductoController {

	private final ProductoRepository repositorio;

	/** Crea un producto. Si faltan datos o son inválidos, Spring responde 400. */
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public Producto crear(@Valid @RequestBody Producto producto) {
		producto.setId(null); // el ID lo genera la base de datos
		return repositorio.save(producto);
	}
}
