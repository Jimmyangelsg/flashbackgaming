// Validación del formulario
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Previene el envio del formulario

        // obtengo todos los valores
        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
        const dni = document.getElementById('dni').value;
        const email = document.getElementById('email').value;
        const telefono = document.getElementById('telefono').value;
        const asunto = document.getElementById('asunto').value;
        const mensaje = document.getElementById('mensaje').value;
        const preferencia = document.getElementById('preferencia').value;
        const terms = document.getElementById('terms').checked;

        // verifico los campos
        let isValid = true;

        if (!nombre.match(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)) {
            alert('Solo letras y espacios en el nombre');
            isValid = false;
        }

        if (!apellido.match(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)) {
            alert('Sólo letras y espacios en el apellido');
            isValid = false;
        }

        if (dni < 0 || dni > 150000000) {
            alert('Utiliza un DNI Válido');
            isValid = false;
        }

        if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
            alert('Utiliza un e-mail válido');
            isValid = false;
        }

        if (!telefono.match(/^\d{10}$/)) {
            alert('Utiliza 10 dígitos para el número telefónico');
            isValid = false;
        }

        if (asunto.trim() === '') {
            alert('Asunto es obligatorio.');
            isValid = false;
        }

        if (mensaje.trim() === '') {
            alert('Mensaje obligatorio');
            isValid = false;
        }

        if (preferencia === '') {
            alert('Preferencia de respuesta obligatoria');
            isValid = false;
        }

        if (!terms) {
            alert('Debe aceptar los términos y condiciones.');
            isValid = false;
        }

        if (isValid) {
            form.submit(); // Envía el formulario si esta todo bien
        }
    });
