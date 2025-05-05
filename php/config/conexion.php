<?php
class Conexion {
    public static function getConexion() {
        $servername = "localhost";
        $username = "root"; 
        $password = ""; 
        $dbname = "tiendaesplendor";

        $conn = new mysqli($servername, $username, $password, $dbname);

        if ($conn->connect_error) {
            die("Conexión fallida: " . $conn->connect_error);
        }
        return $conn;
    }
}
?>