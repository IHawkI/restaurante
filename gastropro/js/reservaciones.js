
(function () {
  'use strict';

  /* Horario en formato 24 h. Claves de getDay(): 0 = domingo ... 6 = sábado */
  var ENTRE_SEMANA = { abre: '13:00', cierra: '22:00' };
  var FIN_DE_SEMANA = { abre: '09:00', cierra: '23:00' };
  var HORARIOS = {
    0: FIN_DE_SEMANA, 1: ENTRE_SEMANA, 2: ENTRE_SEMANA, 3: ENTRE_SEMANA,
    4: ENTRE_SEMANA, 5: ENTRE_SEMANA, 6: FIN_DE_SEMANA
  };

  /* La última reservación se acepta esta cantidad de minutos antes de cerrar */
  var MINUTOS_ANTES_DE_CERRAR = 60;

  var form = document.getElementById('form-reservacion');
  var fecha = document.getElementById('fecha');
  var hora = document.getElementById('hora');
  var ayuda = document.getElementById('hora-ayuda');
  var error = document.getElementById('hora-error');

  function aMinutos(hhmm) {
    var p = hhmm.split(':');
    return parseInt(p[0], 10) * 60 + parseInt(p[1], 10);
  }

  function aHHMM(minutos) {
    var h = Math.floor(minutos / 60);
    var m = minutos % 60;
    return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
  }

  function aTexto12h(hhmm) {
    var min = aMinutos(hhmm);
    var h = Math.floor(min / 60);
    var m = min % 60;
    var sufijo = h >= 12 ? 'pm' : 'am';
    var h12 = h % 12 === 0 ? 12 : h % 12;
    return h12 + ':' + String(m).padStart(2, '0') + ' ' + sufijo;
  }

  /* Devuelve { desde, hasta } (en "HH:MM") para la fecha elegida, o null si no hay fecha */
  function rangoDelDia() {
    if (!fecha.value) return null;
    /* Se agrega T00:00 para que la fecha se interprete en hora local y no se corra un día */
    var dia = new Date(fecha.value + 'T00:00:00').getDay();
    var h = HORARIOS[dia];
    return {
      desde: h.abre,
      hasta: aHHMM(aMinutos(h.cierra) - MINUTOS_ANTES_DE_CERRAR),
      cierra: h.cierra
    };
  }

  function esHoy() {
    var ahora = new Date();
    var hoy = ahora.getFullYear() + '-' +
      String(ahora.getMonth() + 1).padStart(2, '0') + '-' +
      String(ahora.getDate()).padStart(2, '0');
    return fecha.value === hoy;
  }

  function validarHora() {
    var rango = rangoDelDia();

    /* OJO: no se usan los atributos min/max del input de hora a propósito.
       El selector de hora del navegador deshabilita las opciones fuera de ese rango
       y, si la hora elegida estaba fuera, no deja corregirla. La validación se hace
       solo con setCustomValidity. */
    if (!rango) {
      hora.setCustomValidity('');
      ayuda.textContent = 'Elige primero la fecha para ver el horario disponible.';
      return;
    }

    ayuda.textContent = 'Horario de ese día: ' + aTexto12h(rango.desde) + ' a ' +
      aTexto12h(rango.cierra) + '. Última reservación: ' + aTexto12h(rango.hasta) + '.';

    var mensaje = '';
    if (hora.value) {
      var minutos = aMinutos(hora.value);
      if (minutos < aMinutos(rango.desde) || minutos > aMinutos(rango.hasta)) {
        mensaje = 'Ese día reservamos de ' + aTexto12h(rango.desde) + ' a ' + aTexto12h(rango.hasta) + '.';
      } else if (esHoy()) {
        var ahora = new Date();
        if (minutos <= ahora.getHours() * 60 + ahora.getMinutes()) {
          mensaje = 'Esa hora ya pasó. Elige una hora posterior a la actual.';
        }
      }
    }
    hora.setCustomValidity(mensaje);
    error.textContent = mensaje || 'Elige una hora.';
  }

  fecha.addEventListener('input', validarHora);
  fecha.addEventListener('change', validarHora);
  hora.addEventListener('input', validarHora);
  hora.addEventListener('change', validarHora);
  validarHora();

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    GastroPro.aviso('Reservación registrada. ¡Te esperamos!');
    this.reset();
    this.classList.remove('was-validated');
    validarHora();
  });
})();