
(function () {
  'use strict';

  /* 1. Validación (fase de captura: corre antes que los listeners de cada página) */
  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (!form.classList || !form.classList.contains('needs-validation')) return;
    if (!form.checkValidity()) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
    form.classList.add('was-validated');
  }, true);

  /* 2. Avisos */
  function aviso(mensaje, tipo) {
    tipo = tipo || 'success';
    var contenedor = document.getElementById('gp-avisos');
    if (!contenedor) {
      contenedor = document.createElement('div');
      contenedor.id = 'gp-avisos';
      contenedor.className = 'toast-container position-fixed bottom-0 end-0 p-3';
      document.body.appendChild(contenedor);
    }
    var el = document.createElement('div');
    el.className = 'toast align-items-center text-bg-' + tipo + ' border-0';
    el.setAttribute('role', tipo === 'danger' ? 'alert' : 'status');
    el.innerHTML =
      '<div class="d-flex"><div class="toast-body"></div>' +
      '<button type="button" class="btn-close btn-close-white me-2 m-auto" ' +
      'data-bs-dismiss="toast" aria-label="Cerrar"></button></div>';
    el.querySelector('.toast-body').textContent = mensaje;
    contenedor.appendChild(el);
    el.addEventListener('hidden.bs.toast', function () { el.remove(); });
    new bootstrap.Toast(el, { delay: 5000 }).show();
  }

  /* 3. Moneda (pesos mexicanos) */
  var formatoMoneda = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });
  function moneda(numero) { return formatoMoneda.format(numero); }

  window.GastroPro = { aviso: aviso, moneda: moneda };

  /* 4. Fecha mínima = hoy */
  var hoy = new Date();
  var iso = hoy.getFullYear() + '-' +
    String(hoy.getMonth() + 1).padStart(2, '0') + '-' +
    String(hoy.getDate()).padStart(2, '0');
  document.querySelectorAll('input[type="date"][data-hoy-min]').forEach(function (input) {
    input.min = iso;
  });
})();
