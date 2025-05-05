<?php
require_once '../controllers/ProductoController.php';

$tipoProductoId = isset($_GET['tipo_producto_id']) ? (int)$_GET['tipo_producto_id'] : null;

$controller = new ProductoController();
$productos = $controller->listar($tipoProductoId);

header('Content-Type: application/json');
echo json_encode($productos);
?>
