package com.example.pasteleria.repository;

import com.example.pasteleria.entity.Consulta;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConsultaRepository extends JpaRepository<Consulta, Long> {

	List<Consulta> findAllByOrderByFechaDesc();
}
