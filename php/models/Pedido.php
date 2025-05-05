<?php
require_once '../config/conexion.php';

class Pedido {
    private $conn;

    public function __construct() {
        $this->conn = Conexion::getConexion();
    }

    public function crear($usuarioId, $metodoPago) {
        $estado = 'pagado';
        $query = "INSERT INTO pedidos (usuario_id, estado, metodo_pago) VALUES (?, ?, ?)";

        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("iss", $usuarioId, $estado, $metodoPago);

        return $stmt->execute();
    }
}
?>
