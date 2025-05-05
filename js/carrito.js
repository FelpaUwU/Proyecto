document.addEventListener('DOMContentLoaded', function() {
    mostrarCarrito();
    actualizarContadorCarrito();
});

const zonasEnvio = [
    { zona: 'Bogotá', costo: 10000 },
    { zona: 'Medellín', costo: 12000 },
    { zona: 'Cali', costo: 15000 },
    { zona: 'Barranquilla', costo: 18000 },
    { zona: 'Otras ciudades', costo: 20000 }
];


const basePath = window.location.pathname.includes('/pages/') ? '../' : './';

function mostrarCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const contenido = document.getElementById('carrito-contenido');
    const resumen = document.getElementById('resumen-detalles');

    contenido.innerHTML = '';
    resumen.innerHTML = '';

    if (carrito.length === 0) {
        contenido.innerHTML = '<p>Tu carrito está vacío. ¡Sigue comprando!</p>';
        document.getElementById('resumen-compra').style.display = 'none';
        return;
    }

    let total = 0;

    carrito.forEach((producto, index) => {
        const subtotal = producto.precio * producto.cantidad;
        total += subtotal;

        const rutaImagen = producto.imagen ? ('../' + producto.imagen) : (basePath + 'img/default.jpg');

        const stockDisponible = producto.stockDisponible !== undefined ? producto.stockDisponible : producto.cantidad;
        const unidadesDisponibles = Math.max(0, stockDisponible - producto.cantidad);

        const disabledAddButton = producto.cantidad >= stockDisponible ? 'disabled' : '';

        const item = document.createElement('div');
        item.classList.add('carrito-item');
        item.innerHTML = `
            <img src="${rutaImagen}" alt="${producto.nombre}">
            <div class="carrito-item-info">
                <strong>${producto.nombre}</strong><br>
                Precio: $${producto.precio.toLocaleString('es-CO')}<br>
                Subtotal: $${subtotal.toLocaleString('es-CO')}<br>
                Disponible: ${unidadesDisponibles} unidades
            </div>
            <div class="carrito-item-acciones">
                <button class="btn-accion" onclick="cambiarCantidad(${index}, -1)">-</button>
                <span>${producto.cantidad}</span>
                <button class="btn-accion" onclick="cambiarCantidad(${index}, 1)" ${disabledAddButton}>+</button>
                <button class="btn-accion" onclick="eliminarDelCarrito(${index})">🗑️</button>
            </div>
        `;
        contenido.appendChild(item);
    });

    resumen.innerHTML = `
        <p><strong>Productos:</strong> ${carrito.length}</p>
        <p><strong>Total:</strong> $${total.toLocaleString('es-CO')}</p>
    `;

    document.getElementById('resumen-compra').style.display = 'block';
}


function cambiarCantidad(index, cambio) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    if (index < 0 || index >= carrito.length) return;

    const producto = carrito[index];

    if (cambio > 0) {
        if (producto.cantidad >= producto.stockDisponible) {
            mostrarToast('¡No puedes agregar más de las existencias disponibles!');
            return;
        }
    }

    producto.cantidad += cambio;


    if (producto.cantidad < 1) {
        producto.cantidad = 1;
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarToast('Carrito actualizado.');
    mostrarCarrito();
    actualizarContadorCarrito();
}

function eliminarDelCarrito(index) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarToast('Producto eliminado.');
    mostrarCarrito();
    actualizarContadorCarrito();
}

function vaciarCarrito() {
    localStorage.removeItem('carrito');
    mostrarToast('¡Carrito vaciado correctamente!');

    setTimeout(() => {
        mostrarCarrito();
        actualizarContadorCarrito();
    }, 800); 
}

function finalizarCompra() {
    alert('¡Gracias por tu compra! (Aquí podrías integrar pasarela de pago).');
    vaciarCarrito();
}

function pagarConStripe() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const zonaSeleccionada = document.getElementById('zona-envio').value;

    if (carrito.length === 0) {
        mostrarToast('Tu carrito está vacío.');
        return;
    }

    if (!zonaSeleccionada) {
        mostrarToast('Debes seleccionar una zona de envío.');
        return;
    }

    let total = 0;
    carrito.forEach(producto => {
        total += producto.precio * producto.cantidad;
    });

    const envio = zonasEnvio.find(z => z.zona === zonaSeleccionada)?.costo || 0;
    const totalFinal = total + envio;

    const totalCentavos = Math.round(totalFinal * 100); 

    fetch('../php/api/crear_sesion_stripe.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ totalCentavos: totalCentavos })
    })
    .then(response => response.json())
    .then(data => {
        if (data.sessionId) {
            const stripe = Stripe('pk_test_51RIg9YP2rfECdr5uw6EYG8046pSMzUeUy6fXsAkOerIGRap89ulQfX3e3Fh5IKMJpolRPag0HlOl1OttCbzpifVs006vpYFbxI'); 
            stripe.redirectToCheckout({ sessionId: data.sessionId });
        } else {
            mostrarToast('No se pudo iniciar el pago.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarToast('Error iniciando el pago.');
    });
}

function actualizarCostoEnvio() {
    const zonaSeleccionada = document.getElementById('zona-envio').value;
    const costoEnvioDiv = document.getElementById('costo-envio');

    if (!zonaSeleccionada) {
        costoEnvioDiv.innerHTML = '';
        mostrarResumen(); 
        return;
    }

    const envio = zonasEnvio.find(z => z.zona === zonaSeleccionada);

    mostrarResumen(); 
}

function mostrarResumen() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const resumen = document.getElementById('resumen-detalles');

    let total = 0;
    carrito.forEach(producto => {
        total += producto.precio * producto.cantidad;
    });

    const zonaSeleccionada = document.getElementById('zona-envio')?.value;
    const envio = zonasEnvio.find(z => z.zona === zonaSeleccionada)?.costo || 0;

    resumen.innerHTML = `
        <p><strong>Productos:</strong> ${carrito.length}</p>
        <p><strong>Total productos:</strong> $${total.toLocaleString('es-CO')}</p>
        <p><strong>Envío:</strong> $${envio.toLocaleString('es-CO')}</p>
        <hr>
        <p><strong>Total a pagar:</strong> $${(total + envio).toLocaleString('es-CO')}</p>
    `;
}




