function cargarProductos(tipoProductoId = null) {
    const basePath = window.location.pathname.includes('/pages/') ? '../' : '';
    let url = `${basePath}php/api/productos.php`;

    if (tipoProductoId !== null) {
        url += `?tipo_producto_id=${encodeURIComponent(tipoProductoId)}`;
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const contenedor = document.getElementById('contenedor-productos');
            contenedor.innerHTML = '';

            if (!data || data.length === 0) {
                contenedor.innerHTML = '<p>No hay productos disponibles en esta categoría.</p>';
                return;
            }

            data.forEach(producto => {
                const card = document.createElement('div');
                card.classList.add('card', 'product');
            
                const imagenProducto = producto.imagen ? (basePath + producto.imagen) : (basePath + 'img/default.jpg');
            
                const stockDisponible = producto.cantidad > 0 
                    ? `<span style="color: green; font-weight: bold;">✔ Disponible (${producto.cantidad} unidades)</span>` 
                    : `<span style="color: red; font-weight: bold;">❌ Sin stock</span>`;
            
                card.innerHTML = `
                    <img src="${imagenProducto}" alt="${producto.nombre}">
                    <div class="name">${producto.nombre}</div>
                    <div class="price">$${producto.precio.toLocaleString('es-CO')}</div>
                    <div class="stock">${stockDisponible}</div>
                    <button class="btn-agregar" ${producto.cantidad > 0 ? '' : 'disabled style="background: #ccc; cursor: not-allowed;"'} onclick="agregarAlCarrito(
                        ${producto.id},
                        '${producto.nombre}',
                        ${producto.precio},
                        ${producto.cantidad}
                    )">
                        🛒 Agregar
                    </button>
                `;
                contenedor.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error al cargar productos:', error);
            const contenedor = document.getElementById('contenedor-productos');
            contenedor.innerHTML = '<p style="color: red;">Error al cargar productos. Intente más tarde.</p>';
        });
}


function agregarAlCarrito(id, nombre, precio, cantidadDisponible) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    console.log('Cantidad disponible al agregar:', cantidadDisponible);

    const index = carrito.findIndex(item => item.id === id);
    if (index !== -1) {
        if (carrito[index].cantidad + 1 > carrito[index].stockDisponible) {
            mostrarToast('No hay suficiente stock disponible.');
            return;
        }
        carrito[index].cantidad += 1;
    } else {
        if (cantidadDisponible < 1) {
            mostrarToast('Producto agotado.');
            return;
        }

        const productoCard = document.querySelector(`.card.product img[alt="${nombre}"]`);
        let imagen = '';

        if (productoCard) {
            imagen = productoCard.getAttribute('src').replace('../', '').replace('./', '');
        }

        carrito.push({ 
            id, 
            nombre, 
            precio, 
            cantidad: 1, 
            imagen: imagen, 
            stockDisponible: cantidadDisponible
        });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));

    mostrarToast(`Agregaste "${nombre}" al carrito.`);
    actualizarContadorCarrito();
}



function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const totalCantidad = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    const contador = document.getElementById('contador-carrito');
    if (contador) {
        contador.textContent = totalCantidad;
    }
}