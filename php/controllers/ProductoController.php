<?php
require_once '../models/Producto.php';

class ProductoController {
    private $producto;

    public function __construct() {
        $this->producto = new Producto();
    }

    public function listar($categoria = null) {
        return $this->producto->obtenerProductos($categoria);
    }

    public function crear($nombre, $descripcion, $precio, $tipo_producto_id, $ruta_imagen, $cantidad) {
        return $this->producto->crearProducto($nombre, $descripcion, $precio, $tipo_producto_id, $ruta_imagen, $cantidad);
    }

    public function actualizar($id, $nombre, $descripcion, $precio, $tipo_producto_id, $cantidad, $rutaImagen = null) {
        return $this->producto->actualizarProducto($id, $nombre, $descripcion, $precio, $tipo_producto_id, $cantidad, $rutaImagen);
    }

    public function eliminar($id) {
        return $this->producto->eliminarProducto($id);
    }

    public function disminuirStock($productoId, $cantidadVendida) {
        return $this->producto->disminuirStock($productoId, $cantidadVendida);
    }
}
?>
