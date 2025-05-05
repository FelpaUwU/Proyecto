let productosGlobal = [];

function getRutaProductos() {
    if (window.location.pathname.includes('/pages/')) {
        return '../php/api/productos.php';
    } else {
        return 'php/api/productos.php';
    }
}

function cargarProductosEnMemoria() {
    fetch(getRutaProductos())
        .then(response => response.json())
        .then(data => {
            productosGlobal = data;
        })
        .catch(error => console.error('Error cargando productos:', error));
}

function prepararBuscador() {
    const searchInput = document.getElementById('search-input');
    const sugerencias = document.getElementById('sugerencias-busqueda');

    if (!searchInput) return;

    searchInput.addEventListener('input', function () {
        const query = searchInput.value.trim().toLowerCase();
        sugerencias.innerHTML = '';

        if (query.length === 0) {
            sugerencias.style.display = 'none';
            return;
        }

        const resultados = productosGlobal.filter(producto =>
            producto.nombre.toLowerCase().includes(query)
        );

        if (resultados.length > 0) {
            resultados.slice(0, 5).forEach(producto => {
                const div = document.createElement('div');
                div.classList.add('sugerencia-item');
                div.textContent = producto.nombre;
                div.onclick = function() {
                    buscarProductoYRedirigir(producto);
                };
                sugerencias.appendChild(div);
            });

            sugerencias.style.display = 'block';
        } else {
            sugerencias.innerHTML = '<div class="sugerencia-item">No se encontraron productos</div>';
            sugerencias.style.display = 'block';
        }
    });

    document.addEventListener('click', function (e) {
        if (!e.target.closest('.search-container')) {
            sugerencias.style.display = 'none';
        }
    });
}

function buscarProductoYRedirigir(producto) {
    const categoria = producto.tipo_producto_nombre ? producto.tipo_producto_nombre.toLowerCase() : '';

    let url = '';

    switch (categoria) {
        case 'anillos':
            url = 'pages/anillos.html';
            break;
        case 'aretes':
            url = 'pages/aretes.html';
            break;
        case 'cadenas':
            url = 'pages/cadenas.html';
            break;
        case 'collares':
            url = 'pages/collares.html';
            break;
        case 'dijes':
            url = 'pages/dijes.html';
            break;
        case 'pulseras':
            url = 'pages/pulseras.html';
            break;
        case 'relojes':
            url = 'pages/relojes.html';
            break;
        default:
            url = 'index.html'; 
    }

    window.location.href = (window.location.pathname.includes('/pages/') ? '../' : '') + url;
}


document.addEventListener('DOMContentLoaded', function () {
    cargarProductosEnMemoria();
    prepararBuscador();
});
