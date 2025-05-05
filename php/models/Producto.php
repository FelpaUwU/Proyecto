<?php
require_once '../config/conexion.php';

class Producto {
    private $conn;

    public function __construct() {
        $this->conn = Conexion::getConexion();
    }

    public function obtenerProductos($tipoProductoId = null) {
        if ($tipoProductoId !== null) {
            $stmt = $this->conn->prepare("
                SELECT p.id, p.nombre, p.descripcion, p.precio, p.imagen, p.tipo_producto_id, p.cantidad, tp.nombre AS tipo_producto_nombre
                FROM productos p
                LEFT JOIN tipo_producto tp ON p.tipo_producto_id = tp.id
                WHERE p.tipo_producto_id = ?
            ");
            $stmt->bind_param("i", $tipoProductoId);
        } else {
            $stmt = $this->conn->prepare("
                SELECT p.id, p.nombre, p.descripcion, p.precio, p.imagen, p.tipo_producto_id, p.cantidad, tp.nombre AS tipo_producto_nombre
                FROM productos p
                LEFT JOIN tipo_producto tp ON p.tipo_producto_id = tp.id
            ");
        }

        $stmt->execute();
        $result = $stmt->get_result();
        $productos = [];

        while ($row = $result->fetch_assoc()) {
            $productos[] = [
                'id' => (int) $row['id'],
                'nombre' => $row['nombre'],
                'descripcion' => $row['descripcion'],
                'precio' => (float) $row['precio'],
                'imagen' => $row['imagen'],
                'tipo_producto_id' => (int) ($row['tipo_producto_id'] ?? 0),
                'tipo_producto_nombre' => $row['tipo_producto_nombre'] ?? 'Sin categoría',
                'cantidad' => (int) ($row['cantidad'] ?? 0)
            ];
        }

        $stmt->close();
        return $productos;
    }

    public function crearProducto($nombre, $descripcion, $precio, $tipo_producto_id, $ruta_imagen, $cantidad) {
        $stmt = $this->conn->prepare("INSERT INTO productos (nombre, descripcion, precio, tipo_producto_id, imagen, cantidad) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssdssi", $nombre, $descripcion, $precio, $tipo_producto_id, $ruta_imagen, $cantidad);
        return $stmt->execute();
    }

    public function actualizarProducto($id, $nombre, $descripcion, $precio, $tipo_producto_id, $cantidad, $rutaImagen = null) {
        if ($rutaImagen) {
            $stmt = $this->conn->prepare("UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, tipo_producto_id = ?, cantidad = ?, imagen = ? WHERE id = ?");
            $stmt->bind_param("ssdissi", $nombre, $descripcion, $precio, $tipo_producto_id, $cantidad, $rutaImagen, $id);
        } else {
            $stmt = $this->conn->prepare("UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, tipo_producto_id = ?, cantidad = ? WHERE id = ?");
            $stmt->bind_param("ssdiii", $nombre, $descripcion, $precio, $tipo_producto_id, $cantidad, $id);
        }
    
        return $stmt->execute();
    }
    

    public function eliminarProducto($id) {
        $stmt = $this->conn->prepare("DELETE FROM productos WHERE id = ?");
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }

    public function disminuirStock($productoId, $cantidadVendida) {
        $stmt = $this->conn->prepare("UPDATE productos SET cantidad = GREATEST(cantidad - ?, 0) WHERE id = ?");
        $stmt->bind_param("ii", $cantidadVendida, $productoId);
        return $stmt->execute();
    }
    
}
?>
