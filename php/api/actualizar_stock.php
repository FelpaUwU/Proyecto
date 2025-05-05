<?php
require_once '../controllers/ProductoController.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['productos']) || !is_array($data['productos'])) {
    echo json_encode(['success' => false, 'error' => 'Datos de productos no válidos']);
    exit;
}

$productoController = new ProductoController();
$exito = true;

foreach ($data['productos'] as $producto) {
    $id = $producto['id'];
    $cantidadVendida = $producto['cantidad'];

    if (!$productoController->disminuirStock($id, $cantidadVendida)) {
        $exito = false;
        break;
    }
}

echo json_encode(['success' => $exito]);
?>
