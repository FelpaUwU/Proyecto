-- es gestooor de bases de daatos
CREATE DATABASE tienda;

-- Crear tabla de usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    correo VARCHAR(100) UNIQUE,
    contraseña VARCHAR(255),
    direccion VARCHAR(255),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de productos
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    descripcion TEXT,
    precio DECIMAL(10,2),
    imagen VARCHAR(255),
    FOREIGN KEY (tipo_producto_id) REFERENCES tipo_producto(id)
);

ALTER TABLE productos ADD cantidad INT NOT NULL DEFAULT 0;

-- Crear tabla de tipo producto
CREATE TABLE tipo_producto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
);

-- Crear tabla de pedidos
CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('pendiente', 'pagado', 'enviado') DEFAULT 'pendiente',
    metodo_pago ENUM('tarjeta', 'paypal', 'efectivo') DEFAULT 'tarjeta',
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Crear tabla de productos en carrito de compra
CREATE TABLE carrito (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    producto_id INT,
    cantidad INT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Crear tabla de favoritos
CREATE TABLE favoritos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    producto_id INT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);


--Crear usuario ficticio
INSERT INTO usuarios (id, nombre, correo, contraseña) 
VALUES (1, 'Usuario Prueba', 'prueba@correo.com', '1234');


--Insertar tipos de producto
INSERT INTO tipo_producto (nombre) VALUES
('Anillos'),
('Aretes'),
('Cadenas'),
('Collares'),
('Dijes'),
('Pulseras'),
('Relojes');