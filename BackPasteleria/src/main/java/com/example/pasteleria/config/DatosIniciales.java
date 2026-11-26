package com.example.pasteleria.config;

import com.example.pasteleria.entity.Producto;
import com.example.pasteleria.entity.Usuario;
import com.example.pasteleria.repository.ProductoRepository;
import com.example.pasteleria.repository.UsuarioRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

/** Datos que la tienda necesita para funcionar desde el primer arranque. */
@Configuration
public class DatosIniciales {

	/** Crea el administrador de demostración si todavía no existe. */
	@Bean
	public CommandLineRunner crearAdministrador(UsuarioRepository repositorio, PasswordEncoder cifrador,
			@Value("${app.admin.password}") String password) {
		return args -> {
			if (repositorio.existsByEmail("admin@pasteleria.test")) {
				return;
			}
			Usuario admin = new Usuario();
			admin.setNombre("Administrador");
			admin.setApellido("Demo");
			admin.setEmail("admin@pasteleria.test");
			admin.setPassword(cifrador.encode(password));
			admin.setRol("admin");
			admin.setDireccion("Dirección ficticia");
			admin.setTipoPropiedad("Local");
			admin.setRegion("metropolitana");
			admin.setComuna("santiago");
			repositorio.save(admin);
		};
	}

	/**
	 * Carga el catálogo de la pastelería solo si la tabla de productos está vacía.
	 * Así no se duplica al reiniciar ni pisa los cambios que haga el administrador.
	 * Las imágenes son rutas del frontend (carpeta public).
	 */
	@Bean
	public CommandLineRunner cargarCatalogo(ProductoRepository repositorio) {
		return args -> {
			if (repositorio.count() > 0) {
				return;
			}
			repositorio.saveAll(List.of(
					producto("Pastel de Chocolate", "pasteleria", "../Pasteleria/img/pchoco.jpg", 25000,
							"Delicioso pastel de bizcocho de chocolate con relleno de mermelada y manjar."),
					producto("Pastel de Frutilla", "pasteleria", "../Pasteleria/img/pfrut.jpg", 22000,
							"Delicioso pastel de bizcocho de vainilla con relleno de frutilla y crema."),
					producto("Pastel de Vainilla", "pasteleria", "../Pasteleria/img/pvaini.jpg", 20000,
							"Delicioso pastel de bizcocho de vainilla con relleno de vainilla y crema."),

					producto("Pan 5 cereales", "panaderia", "../Panaderia/img/pan.JPG", 2500,
							"Pan de 5 cereales. Pan rústico de corteza crujiente, cubierto con semillas de sésamo, "
									+ "maravilla y zapallo. Contiene 60% de harina de trigo y 40% de harina integral y "
									+ "semillas. Fermentación lenta, solo con masa madre."),
					producto("Pan Ciabatta", "panaderia", "../Panaderia/img/ciabatta.JPG", 2200,
							"Pan ciabatta italiano de alta hidratación y corteza delgada. Contiene aceite de oliva "
									+ "y tiene forma rectangular."),
					producto("Pan Integral", "panaderia", "../Panaderia/img/integral.JPG", 5200,
							"Pan elaborado con 100% harina integral. Contiene semillas de linaza, maravilla, zapallo "
									+ "y sésamo blanco y negro. Su corteza lleva sésamo blanco y linaza. Fermentado con "
									+ "masa madre integral."),

					producto("Quiche de alcachofa y palmitos", "salados", "../Salados/img/Quiche.JPG", 29900,
							"Quiche de alcachofa y palmitos. Masa con suave y cremoso relleno de fondos de alcachofa, "
									+ "palmitos, ricota y tomates cherry."),
					producto("Quiche de espinaca, ricota y champiñón", "salados", "../Salados/img/qespi.JPG", 28000,
							"Quiche de espinaca, ricota y champiñón. Masa con un relleno suave y cremoso de espinaca, "
									+ "ricota y champiñones."),
					producto("Quiche de pollo, choclo y pimentón", "salados", "../Salados/img/qpoio.JPG", 25500,
							"Quiche de pollo, choclo y pimentón. Masa con un relleno suave y cremoso, con trozos de "
									+ "pollo, choclo y pimentón salteado."),

					producto("Kuchen", "sin-azucar", "../SinAzucar/img/kuchen.JPG", 23500,
							"Kuchen de frambuesa y arándanos sin azúcar, relleno con frutas y cubierto con crema "
									+ "de vainilla."),
					producto("Alfajor de chocolate sin azúcar", "sin-azucar", "../SinAzucar/img/alfajor.JPG", 3500,
							"Alfajor de chocolate relleno con manjar y bañado en chocolate (imagen referencial)"),
					producto("Kuchen de durazno", "sin-azucar", "../SinAzucar/img/kudur.JPG", 20000,
							"Kuchen de durazno sin azúcar, con una base de masa rellena con trozos de durazno y "
									+ "crema de vainilla.")));
		};
	}

	private static Producto producto(String titulo, String categoria, String imagen, int precio,
			String descripcion) {
		Producto producto = new Producto();
		producto.setTitulo(titulo);
		producto.setCategoria(categoria);
		producto.setImagen(imagen);
		producto.setPrecio(precio);
		producto.setDescuento(0);
		producto.setDescripcion(descripcion);
		return producto;
	}
}
