<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once '../controllers/ProductoController.php';

if (isset($_POST['nombre'], $_POST['descripcion'], $_POST['precio'], $_POST['tipo_producto_id'], $_POST['cantidad']) && isset($_FILES['imagen'])) {

    $nombre = $_POST['nombre'];
    $descripcion = $_POST['descripcion'];
    $precio = floatval($_POST['precio']);
    $tipo_producto_id = intval($_POST['tipo_producto_id']);
    $cantidad = intval($_POST['cantidad']); 
    $imagen = $_FILES['imagen'];

    $categorias = [
        1 => 'Anillos',
        2 => 'Aretes',
        3 => 'Cadenas',
        4 => 'Collares',
        5 => 'Dijes',
        6 => 'Pulseras',
        7 => 'Relojes'
    ];

    if (!isset($categorias[$tipo_producto_id])) {
        echo json_encode(['success' => false, 'error' => 'Categoría no válida']);
        exit;
    }

    $carpetaDestino = '../../imagenes/' . $categorias[$tipo_producto_id] . '/';

    if (!is_dir($carpetaDestino)) {
        mkdir($carpetaDestino, 0755, true);
    }

    $nombreImagen = uniqid() . '_' . basename($imagen['name']);
    $rutaCompleta = $carpetaDestino . $nombreImagen;

    if (move_uploaded_file($imagen['tmp_name'], $rutaCompleta)) {
        $rutaImagenParaBD = 'imagenes/' . $categorias[$tipo_producto_id] . '/' . $nombreImagen;

        $controller = new ProductoController();
        $resultado = $controller->crear($nombre, $descripcion, $precio, $tipo_producto_id, $rutaImagenParaBD, $cantidad);

        echo json_encode(['success' => $resultado]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Error al mover la imagen']);
    }

} else {
    echo json_encode(['success' => false, 'error' => 'Datos incompletos']);
}
?>
