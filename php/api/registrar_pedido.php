<?php
require_once '../controllers/PedidoController.php';

$data = json_decode(file_get_contents("php://input"), true);

$usuarioId = $data['usuario_id'] ?? null;
$metodoPago = $data['metodo_pago'] ?? 'tarjeta';
$productosCarrito = $data['productos'];

if (!$usuarioId) {
    echo json_encode(['error' => 'Usuario no proporcionado']);
    exit;
}

$pedidoController = new PedidoController();
$success = $pedidoController->crearPedido($usuarioId, $metodoPago, $productosCarrito);

echo json_encode(['success' => $success]);
?>
