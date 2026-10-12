
(function () {
    'use strict';

    var form = document.getElementById('form-contacto');
    var avisos = document.getElementById('contacto-avisos');

    function mostrarExito() {
        avisos.innerHTML =
            '<div class="alert alert-success alert-dismissible fade show" role="alert">' +
            '<strong>¡Mensaje enviado correctamente!</strong> Gracias por escribirnos, te responderemos pronto.' +
            '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar aviso"></button>' +
            '</div>';
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        mostrarExito();
        form.reset();
        form.classList.remove('was-validated');
    });

    /* Al empezar a escribir otro mensaje, se quita el aviso anterior */
    form.addEventListener('input', function () {
        avisos.innerHTML = '';
    });
})();