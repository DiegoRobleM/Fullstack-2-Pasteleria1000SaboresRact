package com.example.pasteleria.repository;

import com.example.pasteleria.entity.Pedido;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

	List<Pedido> findAllByOrderByFechaDesc();

	List<Pedido> findByCorreoClienteOrderByFechaDesc(String correoCliente);
}
