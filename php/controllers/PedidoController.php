<?php
require_once '../models/Pedido.php';
require_once '../models/Producto.php'; 

class PedidoController {
    public function crearPedido($usuarioId, $metodoPago, $productosCarrito) {
        $pedido = new Pedido();
        $resultado = $pedido->crear($usuarioId, $metodoPago);

        return $resultado;
    }
}
?>
