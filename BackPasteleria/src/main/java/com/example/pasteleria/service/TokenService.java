package com.example.pasteleria.service;

import com.example.pasteleria.entity.Usuario;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

/** Genera el token JWT que el front enviará en cada petición protegida. */
@Service
@RequiredArgsConstructor
public class TokenService {

	private final JwtEncoder encoder;

	@Value("${app.jwt.horas:2}")
	private long horasDeValidez;

	public String generar(Usuario usuario) {
		Instant ahora = Instant.now();
		JwtClaimsSet datos = JwtClaimsSet.builder()
				.issuer("pasteleria-1000-sabores")
				.issuedAt(ahora)
				.expiresAt(ahora.plus(horasDeValidez, ChronoUnit.HOURS))
				.subject(usuario.getEmail())
				.claim("rol", usuario.getRol())
				.build();
		JwsHeader cabecera = JwsHeader.with(MacAlgorithm.HS256).build();
		return encoder.encode(JwtEncoderParameters.from(cabecera, datos)).getTokenValue();
	}
}
