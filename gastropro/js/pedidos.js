document.addEventListener('DOMContentLoaded', () => {
  // Elementos del DOM
  const formPedido = document.getElementById('form-pedido');
  const listaInputs = document.querySelectorAll('#lista-pedido input[type="number"]');
  const totalElemento = document.getElementById('total-pedido');
  const resumenVacio = document.getElementById('resumen-vacio');
  const btnCupon = document.getElementById('btn-cupon');
  const inputCupon = document.getElementById('cupon');
  const msgCupon = document.getElementById('mensaje-cupon');
  const lineaDescuento = document.getElementById('linea-descuento');
  const textoDescuento = document.getElementById('texto-descuento');
  const montoDescuento = document.getElementById('monto-descuento');

  const inputFecha = document.getElementById('fecha');
  const inputHora = document.getElementById('hora');
  const horarioInfo = document.getElementById('horario-info');
  const horaError = document.getElementById('hora-error');

  // Cupones disponibles: código -> porcentaje de descuento
  const DESCUENTOS = {
    DESCUENTO10: 0.10,
    DESCUENTO15: 0.15,
    DESCUENTO20: 0.20
  };

  let porcentajeDescuento = 0;
  let cuponCodigo = '';

  // ==========================================
  // 1. FUNCIONES AUXILIARES PARA LOCALSTORAGE
  // ==========================================
  function obtener(clave) {
    return JSON.parse(localStorage.getItem(clave)) || [];
  }

  function guardar(clave, datos) {
    localStorage.setItem(clave, JSON.stringify(datos));
  }

  // ==========================================
  // 2. LÓGICA DE FECHA Y HORA DINÁMICA
  // ==========================================
  if (inputFecha) {
    // Restringir para no elegir fechas pasadas
    const hoy = new Date().toISOString().split('T')[0];
    inputFecha.min = hoy;

    // Escuchar el cambio en la fecha para ajustar el horario permitido
    inputFecha.addEventListener('change', () => {
      if (!inputFecha.value) {
        inputHora.disabled = true;
        inputHora.value = '';
        if (horarioInfo) {
          horarioInfo.textContent = 'Selecciona primero una fecha para ver el horario disponible.';
        }
        return;
      }

      inputHora.disabled = false;

      // Obtener el día de la semana (0 = Domingo, 6 = Sábado)
      const fechaSeleccionada = new Date(inputFecha.value + 'T00:00:00');
      const diaSemana = fechaSeleccionada.getDay();

      if (diaSemana === 0 || diaSemana === 6) {
        // Sábado o Domingo: 9:00 am – 11:00 pm (09:00 a 23:00)
        inputHora.min = '09:00';
        inputHora.max = '23:00';
        if (horarioInfo) {
          horarioInfo.textContent = 'Horario de fin de semana: 9:00 am – 11:00 pm';
        }
        if (horaError) {
          horaError.textContent = 'En fin de semana el horario de atención es de 9:00 am a 11:00 pm.';
        }
      } else {
        // Lunes a Viernes: 1:00 pm – 10:00 pm (13:00 a 22:00)
        inputHora.min = '13:00';
        inputHora.max = '22:00';
        if (horarioInfo) {
          horarioInfo.textContent = 'Horario entre semana: 1:00 pm – 10:00 pm';
        }
        if (horaError) {
          horaError.textContent = 'Entre semana el horario de atención es de 1:00 pm a 10:00 pm.';
        }
      }
    });
  }

  // Validar si la hora ingresada cae dentro del rango del día seleccionado
  function horaValida(fechaStr, horaStr) {
    if (!fechaStr || !horaStr) return false;

    const fechaSeleccionada = new Date(fechaStr + 'T00:00:00');
    const diaSemana = fechaSeleccionada.getDay();
    const [h, m] = horaStr.split(':').map(Number);
    const minutosTotales = h * 60 + m;

    if (diaSemana === 0 || diaSemana === 6) {
      // Fin de semana: 9:00 (540 min) a 23:00 (1380 min)
      return minutosTotales >= 540 && minutosTotales <= 1380;
    } else {
      // Entre semana: 13:00 (780 min) a 22:00 (1320 min)
      return minutosTotales >= 780 && minutosTotales <= 1320;
    }
  }

  // ==========================================
  // 3. CÁLCULO DE TOTAL Y CUPONES
  // ==========================================
  function redondear(numero) {
    return Math.round(numero * 100) / 100;
  }

  function calcularTotal() {
    let subtotal = 0;
    let haySeleccion = false;

    listaInputs.forEach(input => {
      const cantidad = parseInt(input.value) || 0;
      const precio = parseFloat(input.dataset.precio) || 0;
      if (cantidad > 0) {
        subtotal += cantidad * precio;
        haySeleccion = true;
      }
    });

    const descuento = redondear(subtotal * porcentajeDescuento);
    const total = redondear(subtotal - descuento);

    if (totalElemento) {
      totalElemento.textContent = `$${total.toFixed(2)}`;
    }

    // Línea "Descuento" del resumen: solo visible si hay cupón y platillos
    if (lineaDescuento) {
      const hayDescuento = porcentajeDescuento > 0 && subtotal > 0;
      lineaDescuento.classList.toggle('d-none', !hayDescuento);
      if (hayDescuento) {
        textoDescuento.textContent = `Descuento ${Math.round(porcentajeDescuento * 100)}% (${cuponCodigo})`;
        montoDescuento.textContent = `-$${descuento.toFixed(2)}`;
      }
    }

    if (resumenVacio) {
      resumenVacio.style.display = haySeleccion ? 'none' : 'block';
    }

    return total;
  }

  // Escuchar cambios en los inputs numéricos de los platillos
  listaInputs.forEach(input => {
    input.addEventListener('input', calcularTotal);
  });

  // Cupón de descuento
  function mostrarMensajeCupon(texto, claseColor) {
    if (!msgCupon) return;
    msgCupon.textContent = texto;
    msgCupon.className = 'form-text fw-semibold ' + claseColor;
  }

  function quitarCupon() {
    porcentajeDescuento = 0;
    cuponCodigo = '';
  }

  function aplicarCupon() {
    const codigo = inputCupon.value.trim().toUpperCase();

    if (!codigo) {
      quitarCupon();
      mostrarMensajeCupon('Escribe un código de descuento.', 'text-danger');
    } else if (Object.prototype.hasOwnProperty.call(DESCUENTOS, codigo)) {
      porcentajeDescuento = DESCUENTOS[codigo];
      cuponCodigo = codigo;
      mostrarMensajeCupon(`¡Cupón aplicado! Tienes ${Math.round(porcentajeDescuento * 100)}% de descuento.`, 'text-success');
    } else {
      quitarCupon();
      mostrarMensajeCupon('Cupón inválido.', 'text-danger');
    }
    calcularTotal();
  }

  if (btnCupon && inputCupon) {
    btnCupon.addEventListener('click', aplicarCupon);

    // Con Enter se aplica el cupón (sin esto, Enter enviaría el pedido completo)
    inputCupon.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        aplicarCupon();
      }
    });

    // Si cambian el código después de aplicarlo, se quita el descuento hasta volver a aplicar
    inputCupon.addEventListener('input', () => {
      if (porcentajeDescuento > 0) {
        quitarCupon();
        if (msgCupon) msgCupon.textContent = '';
        calcularTotal();
      }
    });
  }

  // ==========================================
  // 4. GENERACIÓN DE ARCHIVO ORDEN.TXT
  // ==========================================
  function exportarOrdenTxt(pedido) {
    let texto = `Comprobante de pedido - GastroPro\n`;
    texto += `Generado: ${new Date().toLocaleString('es-MX')}\n`;
    texto += '='.repeat(40) + '\n\n';
    texto += `Cliente: ${pedido.nombre}\n`;
    texto += `Teléfono: ${pedido.telefono}\n\n`;
    texto += `Platillos solicitados:\n`;

    pedido.platillos.forEach(item => {
      texto += `- ${item.nombre} x${item.cantidad} - $${(item.precio * item.cantidad).toFixed(2)}\n`;
    });

    if (pedido.cupon) {
      const subtotal = pedido.platillos.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
      texto += `\nSubtotal: $${subtotal.toFixed(2)}\n`;
      texto += `Cupón aplicado: ${pedido.cupon} (${Math.round(pedido.porcentajeDescuento * 100)}%)\n`;
      texto += `Descuento: -$${(subtotal - pedido.total).toFixed(2)}\n`;
    } else {
      texto += `\nCupón aplicado: Ninguno\n`;
    }
    texto += `Fecha de recogida: ${pedido.fechaRecogida}\n`;
    texto += `Hora de recogida: ${pedido.horaRecogida}\n`;
    if (pedido.notas) texto += `Notas para cocina: ${pedido.notas}\n`;
    texto += '-'.repeat(40) + '\n';
    texto += `TOTAL CONFIRMADO: $${pedido.total.toFixed(2)}\n`;

    const blob = new Blob([texto], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = 'orden.txt';
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
    URL.revokeObjectURL(url);
  }

  // ==========================================
  // 5. ENVÍO Y VALIDACIÓN DEL FORMULARIO
  // ==========================================
  if (formPedido) {
    formPedido.addEventListener('submit', (e) => {
      e.preventDefault();

      const totalCalculado = calcularTotal();
      const fechaVal = inputFecha ? inputFecha.value : '';
      const horaVal = inputHora ? inputHora.value : '';

      // Validar que se haya seleccionado al menos un platillo
      if (totalCalculado <= 0) {
        alert('Debes seleccionar al menos un platillo para realizar tu pedido.');
        return;
      }

      // Si escribieron un código pero no lo aplicaron, avisar para que no se pierda el descuento
      if (inputCupon && inputCupon.value.trim() !== '' &&
        inputCupon.value.trim().toUpperCase() !== cuponCodigo) {
        alert('Escribiste un cupón pero no lo has aplicado. Presiona "Aplicar" o borra el código.');
        return;
      }

      // Validar la regla de negocio para la hora y fecha
      if (!horaValida(fechaVal, horaVal)) {
        alert('La hora elegida no corresponde al horario de atención permitido para ese día.');
        return;
      }

      // Validación nativa del HTML5 de Bootstrap
      if (!formPedido.checkValidity()) {
        formPedido.classList.add('was-validated');
        return;
      }

      // Recopilar platillos con cantidad > 0
      const platillosSeleccionados = [];
      listaInputs.forEach(input => {
        const cantidad = parseInt(input.value) || 0;
        if (cantidad > 0) {
          platillosSeleccionados.push({
            nombre: input.dataset.nombre,
            precio: parseFloat(input.dataset.precio),
            cantidad: cantidad
          });
        }
      });

      // Crear objeto del nuevo pedido
      const nuevoPedido = {
        id: Date.now(),
        nombre: document.getElementById('nombre').value,
        telefono: document.getElementById('telefono').value,
        fechaRecogida: fechaVal,
        horaRecogida: horaVal,
        notas: document.getElementById('notas').value,
        cupon: cuponCodigo,
        porcentajeDescuento: porcentajeDescuento,
        platillos: platillosSeleccionados,
        total: totalCalculado
      };

      // Guardar en localStorage
      const pedidosPrevios = obtener('pedidos');
      pedidosPrevios.push(nuevoPedido);
      guardar('pedidos', pedidosPrevios);

      // Generar y descargar el archivo orden.txt
      exportarOrdenTxt(nuevoPedido);

      alert('¡Pedido confirmado con éxito! Se ha descargado tu comprobante orden.txt.');

      // Reiniciar el formulario y campos
      formPedido.reset();
      formPedido.classList.remove('was-validated');
      listaInputs.forEach(input => (input.value = 0));
      quitarCupon();
      if (msgCupon) msgCupon.textContent = '';
      if (inputHora) {
        inputHora.disabled = true;
        inputHora.value = '';
      }
      if (horarioInfo) {
        horarioInfo.textContent = 'Selecciona primero una fecha para ver el horario disponible.';
      }
      calcularTotal();
    });
  }
});