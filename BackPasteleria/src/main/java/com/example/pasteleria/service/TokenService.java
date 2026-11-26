package com.example.pasteleria.service;

import com.example.pasteleria.entity.Usuario;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

/**
 * Genera el token JWT que el front enviará en cada petición protegida.
 * Cada token dura pocas horas; el front lo renueva mientras el usuario está activo.
 * El dato "inicio" guarda cuándo se inició sesión con contraseña, para que la
 * sesión no se pueda alargar indefinidamente con renovaciones.
 */
@Service
@RequiredArgsConstructor
public class TokenService {

	private static final String INICIO = "inicio";

	private final JwtEncoder encoder;

	@Value("${app.jwt.horas:2}")
	private long horasDeValidez;

	@Value("${app.jwt.dias-maximos:7}")
	private long diasMaximos;

	/** Token nuevo después de iniciar sesión con correo y contraseña. */
	public String generar(Usuario usuario) {
		return generar(usuario, Instant.now());
	}

	/**
	 * Token nuevo a partir de uno vigente. Mantiene la hora del inicio de sesión
	 * original y responde 401 si ya pasó el máximo de días permitido.
	 */
	public String renovar(Usuario usuario, Jwt actual) {
		Instant inicio = inicioDeSesion(actual);
		if (inicio.plus(diasMaximos, ChronoUnit.DAYS).isBefore(Instant.now())) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
					"Tu sesión superó el tiempo máximo. Inicia sesión nuevamente.");
		}
		return generar(usuario, inicio);
	}

	private String generar(Usuario usuario, Instant inicio) {
		Instant ahora = Instant.now();
		JwtClaimsSet datos = JwtClaimsSet.builder()
				.issuer("pasteleria-1000-sabores")
				.issuedAt(ahora)
				.expiresAt(ahora.plus(horasDeValidez, ChronoUnit.HOURS))
				.subject(usuario.getEmail())
				.claim("rol", usuario.getRol())
				.claim(INICIO, inicio.getEpochSecond())
				.build();
		JwsHeader cabecera = JwsHeader.with(MacAlgorithm.HS256).build();
		return encoder.encode(JwtEncoderParameters.from(cabecera, datos)).getTokenValue();
	}

	/** Tokens antiguos sin "inicio" usan su fecha de emisión. */
	private Instant inicioDeSesion(Jwt token) {
		Object valor = token.getClaims().get(INICIO);
		if (valor instanceof Number segundos) {
			return Instant.ofEpochSecond(segundos.longValue());
		}
		return token.getIssuedAt() != null ? token.getIssuedAt() : Instant.now();
	}
}
