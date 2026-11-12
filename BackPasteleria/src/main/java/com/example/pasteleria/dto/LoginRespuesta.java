package com.example.pasteleria.dto;

import com.example.pasteleria.entity.Usuario;

/** Lo que devuelve el login: el token y los datos del usuario (sin contraseña). */
public record LoginRespuesta(String token, Usuario usuario) {
}
