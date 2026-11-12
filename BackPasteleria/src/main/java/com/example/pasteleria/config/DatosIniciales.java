package com.example.pasteleria.config;

import com.example.pasteleria.entity.Usuario;
import com.example.pasteleria.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

/** Crea el administrador de demostración si todavía no existe. */
@Configuration
public class DatosIniciales {

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
}
