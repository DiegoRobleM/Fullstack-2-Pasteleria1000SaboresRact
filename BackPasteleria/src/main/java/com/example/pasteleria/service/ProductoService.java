package com.example.pasteleria.service;

import com.example.pasteleria.entity.Producto;
import com.example.pasteleria.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
}
