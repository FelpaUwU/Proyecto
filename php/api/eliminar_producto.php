<?php
require_once '../controllers/ProductoController.php';

$data = json_decode(file_get_contents("php://input"), true);

$controller = new ProductoController();
$result = $controller->eliminar($data['id']);

echo json_encode(['success' => $result]);
?>
