console.log('app.js cargado');

// Configuración de productos con stock y descuentos
const productos = {
    snes: {
        nombre: 'Super Nintendo Entertainment System (SNES)',
        precio: 138000,
        stock: 10,
        descuento: 0.1  // 10% de descuento
    },
    n64: {
        nombre: 'Nintendo 64',
        precio: 92000,
        stock: 15,
        descuento: 0.05  // 5% de descuento
    },
    gamecube: {
        nombre: 'Gamecube',
        precio: 95000,
        stock: 8,
        descuento: 0  // Sin descuento
    },
    sgg: {
        nombre: 'SEGA Game Gear',
        precio: 115000,
        stock: 10,
        descuento: 0.1  // 10% de descuento
    },
    ssaturn: {
        nombre: 'SEGA Saturn',
        precio: 100000,
        stock: 10,
        descuento: 0.1  // 10% de descuento
    },
    sdreamcast: {
        nombre: 'SEGA Dreamcast',
        precio: 172500,
        stock: 10,
        descuento: 0.1  // 10% de descuento
    },
    xbox: {
        nombre: 'Xbox',
        precio: 138000,
        stock: 10,
        descuento: 0.1  // 10% de descuento
    },
    xbox360: {
        nombre: 'Xbox 360',
        precio: 130000,
        stock: 10,
        descuento: 0.1  // 10% de descuento
    },
    xbox360e: {
        nombre: 'Xbox 360 Élite',
        precio: 156000,
        stock: 10,
        descuento: 0.1  // 10% de descuento
    },
    ps1: {
        nombre: 'Playstation 1',
        precio: 115000,
        stock: 10,
        descuento: 0.1  // 10% de descuento
    },
    ps2: {
        nombre: 'Playstation 2',
        precio: 172500,
        stock: 10,
        descuento: 0.1  // 10% de descuento
    },
    psp: {
        nombre: 'PSP (PlayStation Portable)',
        precio: 115000,
        stock: 10,
        descuento: 0.1  // 10% de descuento
    }
};

const IVA = 0.21;  // 21% de IVA

document.addEventListener('DOMContentLoaded', cargarCarrito);

function actualizarEstadoBotonCompra() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const botonCompra = document.getElementById('realizarCompraBtn');
    botonCompra.disabled = carrito.length === 0;
}

function agregarAlCarrito(nombre, precio, productoKey) {
    const producto = productos[productoKey];

    if (producto.stock <= 0) {
        alert('¡Producto agotado!');
        return;
    }

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const productoEnCarrito = carrito.find(item => item.productoKey === productoKey);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
    } else {
        carrito.push({
            nombre: producto.nombre,
            precio: producto.precio,
            productoKey: productoKey,
            cantidad: 1
        });
    }

    producto.stock--;
    document.getElementById(`stock-${productoKey}`).textContent = producto.stock;

    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderizarCarrito();
    actualizarContadorCarrito();
    actualizarEstadoBotonCompra();
    mostrarCheckout();
}

function renderizarCarrito() {
    const listaCarrito = document.getElementById('lista-carrito');
    const subtotalCarrito = document.getElementById('subtotal-carrito');
    const descuentoCarrito = document.getElementById('descuento-carrito');
    const ivaCarrito = document.getElementById('iva-carrito');
    const totalCarrito = document.getElementById('total-carrito');
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    listaCarrito.innerHTML = '';

    let subtotal = 0;
    let descuentoTotal = 0;

    carrito.forEach((producto, index) => {
        const productoInfo = productos[producto.productoKey];
        const li = document.createElement('li');

        const descuentoProducto = productoInfo.descuento * producto.precio;
        const precioConDescuento = producto.precio - descuentoProducto;

        li.innerHTML = `
            ${producto.nombre} - $${producto.precio} x ${producto.cantidad}
            ${productoInfo.descuento > 0 ?
                `<span class="descuento">(Desc. ${(productoInfo.descuento * 100).toFixed(0)}%:
                -$${descuentoProducto.toFixed(2)})</span>`
                : ''}
        `;

        const botonEliminar = document.createElement('button');
        botonEliminar.textContent = 'Eliminar';
        botonEliminar.onclick = () => eliminarDelCarrito(index);

        const inputCantidad = document.createElement('input');
        inputCantidad.type = 'number';
        inputCantidad.value = producto.cantidad;
        inputCantidad.min = 1;
        inputCantidad.max = productoInfo.stock + producto.cantidad;
        inputCantidad.onchange = (event) => actualizarCantidad(index, event.target.value);

        li.appendChild(inputCantidad);
        li.appendChild(botonEliminar);
        listaCarrito.appendChild(li);

        subtotal += producto.precio * producto.cantidad;
        descuentoTotal += descuentoProducto * producto.cantidad;
    });

    const ivaTotal = (subtotal - descuentoTotal) * IVA;
    const total = subtotal - descuentoTotal + ivaTotal;

    subtotalCarrito.textContent = subtotal.toFixed(2);
    descuentoCarrito.textContent = descuentoTotal.toFixed(2);
    ivaCarrito.textContent = ivaTotal.toFixed(2);
    totalCarrito.textContent = total.toFixed(2);

    const modalSubtotal = document.getElementById('modal-subtotal');
    const modalDescuento = document.getElementById('modal-descuento');
    const modalIva = document.getElementById('modal-iva');
    const modalTotal = document.getElementById('modal-total');

    if (modalSubtotal && modalDescuento && modalIva && modalTotal) {
        modalSubtotal.textContent = subtotal.toFixed(2);
        modalDescuento.textContent = descuentoTotal.toFixed(2);
        modalIva.textContent = ivaTotal.toFixed(2);
        modalTotal.textContent = total.toFixed(2);
    }
}

function eliminarDelCarrito(index) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const producto = productos[carrito[index].productoKey];

    producto.stock += carrito[index].cantidad;
    document.getElementById(`stock-${carrito[index].productoKey}`).textContent = producto.stock;

    carrito.splice(index, 1);

    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderizarCarrito();
    actualizarContadorCarrito();
    actualizarEstadoBotonCompra();
}

function actualizarCantidad(index, nuevaCantidad) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const producto = productos[carrito[index].productoKey];

    if (nuevaCantidad > producto.stock + carrito[index].cantidad) {
        alert('No hay suficiente stock disponible.');
        return;
    }

    const cantidadAnterior = carrito[index].cantidad;
    carrito[index].cantidad = parseInt(nuevaCantidad);

    producto.stock += cantidadAnterior - carrito[index].cantidad;
    document.getElementById(`stock-${carrito[index].productoKey}`).textContent = producto.stock;

    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderizarCarrito();
    actualizarContadorCarrito();
}

function vaciarCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.forEach(item => {
        const producto = productos[item.productoKey];
        producto.stock += item.cantidad;
        document.getElementById(`stock-${item.productoKey}`).textContent = producto.stock;
    });

    localStorage.removeItem('carrito');
    renderizarCarrito();
    actualizarContadorCarrito();
    actualizarEstadoBotonCompra();
}

function cargarCarrito() {
    renderizarCarrito();
    actualizarContadorCarrito();
    actualizarEstadoBotonCompra();
}

function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const contadorCarrito = document.getElementById('cart-count');
    const totalProductos = carrito.reduce((total, producto) => total + producto.cantidad, 0);
    console.log('Actualizando contador del carrito:', totalProductos);
    contadorCarrito.textContent = totalProductos;
}

function mostrarCheckout() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    if (carrito.length === 0) {
        alert('El carrito está vacío');
        return;
    }

    const modal = document.getElementById('checkoutModal');
    const offcanvas = new bootstrap.Offcanvas(modal);
    offcanvas.show();

    const subtotal = parseFloat(document.getElementById('subtotal-carrito').textContent);
    const descuento = parseFloat(document.getElementById('descuento-carrito').textContent);
    const iva = parseFloat(document.getElementById('iva-carrito').textContent);
    const total = parseFloat(document.getElementById('total-carrito').textContent);

    const modalSubtotal = document.getElementById('modal-subtotal');
    const modalDescuento = document.getElementById('modal-descuento');
    const modalIva = document.getElementById('modal-iva');
    const modalTotal = document.getElementById('modal-total');

    if (modalSubtotal && modalDescuento && modalIva && modalTotal) {
        modalSubtotal.textContent = subtotal.toFixed(2);
        modalDescuento.textContent = descuento.toFixed(2);
        modalIva.textContent = iva.toFixed(2);
        modalTotal.textContent = total.toFixed(2);
    }
}

function realizarCompra() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    if (carrito.length === 0) {
        alert('Carrito Vacío,por favor añade productos antes de realizar la compra.');
        return;
    }

    // Creo el mensaje de whatsapp
    let mensaje = '¡Hola! Estoy interesado en realizar la siguiente compra:\n\n';
    
    // Se agregan los productos
    carrito.forEach(item => {
        mensaje += `- ${item.nombre} x${item.cantidad} = $${(item.precio * item.cantidad).toFixed(2)}\n`;
    });

    // Se agregan costos
    const subtotal = parseFloat(document.getElementById('subtotal-carrito').textContent);
    const descuento = parseFloat(document.getElementById('descuento-carrito').textContent);
    const iva = parseFloat(document.getElementById('iva-carrito').textContent);
    const total = parseFloat(document.getElementById('total-carrito').textContent);

    mensaje += `\nSubtotal: $${subtotal.toFixed(2)}`;
    mensaje += `\nDescuento: $${descuento.toFixed(2)}`;
    mensaje += `\nIVA: $${iva.toFixed(2)}`;
    mensaje += `\nTotal: $${total.toFixed(2)}`;

    // Número de teléfono de destino
    const telefono = '';
    const mensajeCodificado = encodeURIComponent(mensaje);
    
    // Enlace a Whatsapp
    const urlWhatsApp = `https://wa.me/${telefono}?text=${mensajeCodificado}`;

    alert('¡Compra procesada exitosamente! Te redirigiremos a WhatsApp para completar el pago y coordinar el envío.');
    
    // Limpiar el carrito
    localStorage.removeItem('carrito');
    cerrarCheckout();
    renderizarCarrito();
    actualizarContadorCarrito();
    actualizarEstadoBotonCompra();

    // Abrir WhatsApp en una nueva pestaña
    window.open(urlWhatsApp, '_blank');
}

function cerrarCheckout() {
    const modal = document.getElementById('checkoutModal');
    const offcanvas = bootstrap.Offcanvas.getInstance(modal);
    offcanvas.hide();
}

document.getElementById('cart-button').addEventListener('click', function() {
    mostrarCheckout();
});

document.addEventListener('DOMContentLoaded', function() {
    cargarCarrito();
    actualizarEstadoBotonCompra();
});