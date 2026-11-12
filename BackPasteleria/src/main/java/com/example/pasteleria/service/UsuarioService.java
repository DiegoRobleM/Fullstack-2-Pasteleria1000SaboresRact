package com.example.pasteleria.service;

import com.example.pasteleria.dto.LoginRespuesta;
import com.example.pasteleria.dto.LoginSolicitud;
import com.example.pasteleria.entity.Usuario;
import com.example.pasteleria.repository.UsuarioRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class UsuarioService {

	private final UsuarioRepository repositorio;
	private final PasswordEncoder cifrador;
	private final TokenService tokens;

	/** Crea una cuenta de cliente. Responde 409 si el correo ya existe. */
	@Transactional
	public Usuario registrar(Usuario usuario) {
		usuario.setId(null);
		usuario.setEmail(usuario.getEmail().trim().toLowerCase());
		if (repositorio.existsByEmail(usuario.getEmail())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe una cuenta asociada a ese correo.");
		}
		usuario.setRol("cliente"); // El registro público nunca crea administradores.
		usuario.setPassword(cifrador.encode(usuario.getPassword()));
		return repositorio.save(usuario);
	}

	/** Valida correo y contraseña y devuelve un token. Responde 401 si no coinciden. */
	@Transactional(readOnly = true)
	public LoginRespuesta login(LoginSolicitud solicitud) {
		Usuario usuario = repositorio.findByEmail(solicitud.email().trim().toLowerCase())
				.filter(u -> cifrador.matches(solicitud.password(), u.getPassword()))
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED,
						"El correo o la contraseña son incorrectos."));
		return new LoginRespuesta(tokens.generar(usuario), usuario);
	}

	@Transactional(readOnly = true)
	public List<Usuario> listar() {
		return repositorio.findAll();
	}

	@Transactional(readOnly = true)
	public Usuario buscar(Long id) {
		return repositorio.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado."));
	}

	/** Edita un usuario conservando su ID. 404 si no existe, 409 si el correo nuevo ya está en uso. */
	@Transactional
	public Usuario actualizar(Long id, Usuario datos) {
		Usuario usuario = buscar(id);
		String email = datos.getEmail().trim().toLowerCase();
		if (!email.equals(usuario.getEmail()) && repositorio.existsByEmail(email)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe una cuenta asociada a ese correo.");
		}
		usuario.setNombre(datos.getNombre());
		usuario.setApellido(datos.getApellido());
		usuario.setEmail(email);
		usuario.setPassword(cifrador.encode(datos.getPassword()));
		if ("admin".equals(datos.getRol()) || "cliente".equals(datos.getRol())) {
			usuario.setRol(datos.getRol());
		}
		usuario.setDireccion(datos.getDireccion());
		usuario.setTipoPropiedad(datos.getTipoPropiedad());
		usuario.setRegion(datos.getRegion());
		usuario.setComuna(datos.getComuna());
		return repositorio.save(usuario);
	}

	@Transactional
	public void eliminar(Long id) {
		if (!repositorio.existsById(id)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado.");
		}
		repositorio.deleteById(id);
	}
}
