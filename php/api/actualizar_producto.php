<?php
require_once '../controllers/ProductoController.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = intval($_POST['id']);
    $nombre = $_POST['nombre'];
    $descripcion = $_POST['descripcion'];
    $precio = floatval($_POST['precio']);
    $tipo_producto_id = intval($_POST['tipo_producto_id']);
    $cantidad = intval($_POST['cantidad']);

    $nuevaImagen = null;

    if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === 0) {

        $imagen = $_FILES['imagen'];

        $nombreImagen = uniqid() . '_' . basename($imagen['name']);
        $carpetaDestino = '../../imagenes/';

        if (!is_dir($carpetaDestino)) {
            mkdir($carpetaDestino, 0755, true);
        }

        $rutaCompleta = $carpetaDestino . $nombreImagen;

        if (move_uploaded_file($imagen['tmp_name'], $rutaCompleta)) {
            $nuevaImagen = 'imagenes/' . $nombreImagen;
        }
    }

    $controller = new ProductoController();
    $resultado = $controller->actualizar($id, $nombre, $descripcion, $precio, $tipo_producto_id, $cantidad, $nuevaImagen);

    echo json_encode(['success' => $resultado]);
}
?>
