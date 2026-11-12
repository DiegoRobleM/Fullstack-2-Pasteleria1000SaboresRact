package com.example.pasteleria.config;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import java.nio.charset.StandardCharsets;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

/** Seguridad con token JWT: sin sesiones, el front envía "Authorization: Bearer <token>". */
@Configuration
@SecurityScheme(name = "bearerAuth", type = SecuritySchemeType.HTTP, scheme = "bearer", bearerFormat = "JWT")
public class SecurityConfig {

	@Value("${app.jwt.secret}")
	private String secreto;

	@Bean
	public SecurityFilterChain filtros(HttpSecurity http) throws Exception {
		http
				.csrf(csrf -> csrf.disable()) // No hay formularios con sesión: se usa token.
				.cors(Customizer.withDefaults()) // Usa la configuración de CorsConfig.
				.sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(rutas -> rutas
						.requestMatchers("/api/usuarios/**").hasRole("admin")
						.anyRequest().permitAll())
				.oauth2ResourceServer(o -> o.jwt(jwt -> jwt.jwtAuthenticationConverter(convertidorDeRoles())));
		return http.build();
	}

	/** Lee el dato "rol" del token y lo convierte en ROLE_admin o ROLE_cliente. */
	private JwtAuthenticationConverter convertidorDeRoles() {
		JwtGrantedAuthoritiesConverter roles = new JwtGrantedAuthoritiesConverter();
		roles.setAuthoritiesClaimName("rol");
		roles.setAuthorityPrefix("ROLE_");
		JwtAuthenticationConverter convertidor = new JwtAuthenticationConverter();
		convertidor.setJwtGrantedAuthoritiesConverter(roles);
		return convertidor;
	}

	@Bean
	public PasswordEncoder cifrador() {
		return new BCryptPasswordEncoder();
	}

	private SecretKey clave() {
		return new SecretKeySpec(secreto.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
	}

	@Bean
	public JwtEncoder jwtEncoder() {
		return new NimbusJwtEncoder(new ImmutableSecret<>(clave()));
	}

	@Bean
	public JwtDecoder jwtDecoder() {
		return NimbusJwtDecoder.withSecretKey(clave()).macAlgorithm(MacAlgorithm.HS256).build();
	}
}
