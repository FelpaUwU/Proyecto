<?php
require_once '../config/conexion.php';

$conn = Conexion::getConexion();

$result = $conn->query("SELECT id, nombre FROM tipo_producto");

$tipos = [];
while ($row = $result->fetch_assoc()) {
    $tipos[] = $row;
}

header('Content-Type: application/json');
echo json_encode($tipos);
?>
