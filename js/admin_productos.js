document.addEventListener('DOMContentLoaded', function () {
    cargarTiposProducto();
    cargarProductos();

    document.getElementById('btn-guardar').addEventListener('click', function (event) {
        event.preventDefault();
        guardarProducto();
    });

    document.getElementById('btn-cancelar').addEventListener('click', cerrarModalConfirmar);
    document.getElementById('btn-confirmar').addEventListener('click', function () {
        if (accionConfirmar) {
            accionConfirmar();
            cerrarModalConfirmar();
        }
    });

    const inputImagen = document.getElementById('imagen');
    
    if (inputImagen) {
        inputImagen.addEventListener('change', function(event) {
            const preview = document.getElementById('preview-imagen');
            const file = event.target.files[0];

            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            } else {
                preview.style.display = 'none';
            }
        });
    }
});

window.addEventListener('click', function (event) {
    const modal = document.getElementById('modal-producto');
    if (event.target === modal) {
        cerrarModal();
    }
});

window.addEventListener('click', function (event) {
    const modalConfirmar = document.getElementById('modal-confirmar');
    if (event.target === modalConfirmar) {
        cerrarModalConfirmar();
    }
});

function cargarProductos() {
    fetch('../php/api/productos.php')
        .then(response => response.json())
        .then(data => {
            const tabla = document.getElementById('tabla-productos');
            tabla.innerHTML = '';

            data.forEach(producto => {
                const fila = document.createElement('tr');

                fila.innerHTML = `
                    <td>${producto.nombre}</td>
                    <td>${producto.descripcion}</td>
                    <td>$${parseFloat(producto.precio).toLocaleString('es-CO')}</td>
                    <td>${producto.tipo_producto_nombre || 'Sin categoría'}</td>
                    <td>${producto.cantidad || 'Sin stock'}</td>
                    <td>
                        <button class="btn-edit">Editar</button>
                        <button class="btn-delete">Eliminar</button>
                    </td>
                `;

                const [btnEditar, btnEliminar] = fila.querySelectorAll('button');

                btnEditar.addEventListener('click', () => {
                    abrirModalEditar(producto); 
                });

                btnEliminar.addEventListener('click', () => {
                    eliminarProducto(producto.id);
                });

                tabla.appendChild(fila);
            });

            productosGlobal = data;
        })
        .catch(error => console.error('Error cargando productos:', error));
}

function guardarProducto() {
    const btnGuardar = document.getElementById('btn-guardar');

    const id = document.getElementById('producto-id').value;
    const nombre = document.getElementById('nombre').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();
    const precio = parseFloat(document.getElementById('precio').value);
    const tipo_producto_id = parseInt(document.getElementById('tipo_producto_id').value);
    const cantidad = parseInt(document.getElementById('cantidad').value);
    const imagen = document.getElementById('imagen').files[0];

    if (!nombre || !descripcion || isNaN(precio) || isNaN(tipo_producto_id) || isNaN(cantidad)) {
        mostrarToast('Debe completar todos los campos correctamente');
        return;
    }

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('precio', precio);
    formData.append('tipo_producto_id', tipo_producto_id);
    formData.append('cantidad', cantidad);
    formData.append('imagen', imagen);

    if (id) {
        formData.append('id', id);
    }

    let url = '../php/api/crear_producto.php';
    if (id && id !== "") {
        url = '../php/api/actualizar_producto.php'; 
    }

    btnGuardar.disabled = true;

    fetch(url, {
        method: 'POST',
        body: formData 
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            mostrarToast('Producto guardado correctamente');
            cerrarModal();
            cargarProductos();
        } else {
            mostrarToast('Error al guardar producto: ' + (data.error || ''));
        }
    })
    .catch(error => {
        console.error('Error al guardar producto:', error);
        mostrarToast('Error crítico al guardar producto');
    })
    .finally(() => {
        btnGuardar.disabled = false;
    });
}




function abrirModal() {
    limpiarFormulario();
    document.getElementById('form-title').innerText = 'Agregar Nuevo Producto';
    document.getElementById('btn-guardar').textContent = 'Guardar Producto';

    const form = document.getElementById('form-producto');
    form.onsubmit = function (event) {
        event.preventDefault();
        guardarProducto();
    };

    const modal = document.getElementById('modal-producto');
    modal.style.display = 'block';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

function abrirModalEditar(producto) {
    document.getElementById('form-title').innerText = 'Editar Producto';
    document.getElementById('btn-guardar').textContent = 'Actualizar Producto';

    document.getElementById('producto-id').value = producto.id;
    document.getElementById('nombre').value = producto.nombre;
    document.getElementById('descripcion').value = producto.descripcion;
    document.getElementById('precio').value = producto.precio;
    document.getElementById('tipo_producto_id').value = producto.tipo_producto_id;
    document.getElementById('cantidad').value = producto.cantidad;

    // Limpiar input de imagen
    const inputImagen = document.getElementById('imagen');
    inputImagen.value = "";

    // Mostrar preview de imagen existente
    const preview = document.getElementById('preview-imagen');
    if (producto.imagen) {
        preview.src = '../' + producto.imagen; 
        preview.style.display = 'block';
    } else {
        preview.style.display = 'none';
    }

    const form = document.getElementById('form-producto');
    form.onsubmit = function (event) {
        event.preventDefault();
        guardarProducto();
    };

    const modal = document.getElementById('modal-producto');
    modal.style.display = 'block';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}



function cerrarModal() {
    document.getElementById('modal-producto').style.display = 'none';
}

function eliminarProducto(id) {
    abrirModalConfirmar('¿Estás seguro de eliminar este producto?', function () {

        fetch('../php/api/eliminar_producto.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    mostrarToast('Producto eliminado exitosamente');
                    cargarProductos();
                } else {
                    mostrarToast('Error al eliminar producto');
                }
            })
            .catch(error => {
                console.error('Error al eliminar producto:', error);
                mostrarToast('Error crítico al eliminar producto');
            })
    });
}

function cargarTiposProducto(callback = null) {
    fetch('../php/api/tipo_productos.php')
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById('tipo_producto_id');
            select.innerHTML = '<option value="">Seleccione una categoría</option>';

            data.forEach(tipo => {
                const option = document.createElement('option');
                option.value = tipo.id;
                option.textContent = tipo.nombre;
                select.appendChild(option);
            });

            if (callback) {
                callback();
            }
        })
        .catch(error => console.error('Error cargando tipos de producto:', error));
}

function limpiarFormulario() {
    document.getElementById('form-title').innerText = 'Agregar Nuevo Producto';
    document.getElementById('btn-guardar').textContent = 'Guardar Producto';
    document.getElementById('producto-id').value = '';
    document.getElementById('nombre').value = '';
    document.getElementById('descripcion').value = '';
    document.getElementById('precio').value = '';
    document.getElementById('tipo_producto_id').value = '';
    document.getElementById('cantidad').value = '';

    const inputImagen = document.getElementById('imagen');
    if (inputImagen) {
        const nuevoInput = inputImagen.cloneNode(true); 
        inputImagen.parentNode.replaceChild(nuevoInput, inputImagen);  
    }

    const preview = document.getElementById('preview-imagen');
    preview.src = '';
    preview.style.display = 'none';
}



let accionConfirmar = null;

function abrirModalConfirmar(mensaje, callback) {
    document.getElementById('confirmar-titulo').innerText = 'Confirmar Eliminación';
    document.getElementById('confirmar-mensaje').innerText = mensaje;
    accionConfirmar = callback;

    const modalConfirmar = document.getElementById('modal-confirmar');
    modalConfirmar.style.display = 'block';
    setTimeout(() => {
        modalConfirmar.classList.add('show');
    }, 10);
}

function cerrarModalConfirmar() {
    const modalConfirmar = document.getElementById('modal-confirmar');
    modalConfirmar.classList.remove('show');
    setTimeout(() => {
        modalConfirmar.style.display = 'none';
    }, 400);
}

