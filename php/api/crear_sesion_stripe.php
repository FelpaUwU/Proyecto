<?php
require_once '../../vendor/autoload.php';

\Stripe\Stripe::setApiKey('sk_test_51RIg9YP2rfECdr5uy5NuESpuwT3bxyxKsTvvkw08MNJG0mv4WbixbnsfJxYobxQHNSc6okBeDqV7VOVTV9z6kMqX009eYBLlW1');

header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['totalCentavos'])) {
    echo json_encode(['error' => 'Total no proporcionado']);
    http_response_code(400);
    exit;
}

$total = $input['totalCentavos']; 
$totalCentavos = intval($total); 


try {
    $checkout_session = \Stripe\Checkout\Session::create([
        'payment_method_types' => ['card'],
        'line_items' => [[
            'price_data' => [
                'currency' => 'cop', 
                'product_data' => [
                    'name' => 'Compra en Mi Tienda',
                ],
                'unit_amount' => $totalCentavos, 
            ],
            'quantity' => 1,
        ]],
        'mode' => 'payment',
        'success_url' => 'http://localhost:82/ProyectoEsplendor/pages/compra_exitosa.html',
        'cancel_url' => 'http://localhost:82/ProyectoEsplendor/pages/compra_fallida.html',
    ]);

    echo json_encode(['sessionId' => $checkout_session->id]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
