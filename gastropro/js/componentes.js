
(function () {
  'use strict';

  /* ---- Datos del restaurante (CAMBIAR por los reales) ---- */
  var SITIO = {
    nombre: 'GastroPro',
    eslogan: 'Cocina de calidad, lista cuando tú lo estés.',
    direccion: 'Blvrd 22 sur 6108, 72570 Puebla, Pue.',
    telefono: '221 190 8923',
    correo: 'gatropro@gmail.com',
    horarios: [
      'Lunes a viernes: 1:00 – 10:00 pm',
      'Sábado y domingo: 9:00 am – 11:00 pm'
    ]
  };

  /* ---- Páginas del sitio (el id debe coincidir con data-pagina) ---- */
  var PAGINAS = [
    { id: 'inicio', href: 'index.html', texto: 'Inicio' },
    { id: 'menu', href: 'menu.html', texto: 'Menú' },
    { id: 'pedidos', href: 'pedidos.html', texto: 'Pedidos' },
    { id: 'reservaciones', href: 'reservaciones.html', texto: 'Reservaciones' },
    { id: 'contacto', href: 'contacto.html', texto: 'Contacto' }
  ];

  var actual = document.body.getAttribute('data-pagina');

  /* ---- Navbar ---- */
  var enlaces = PAGINAS.map(function (p) {
    var activo = p.id === actual;
    return '<li class="nav-item">' +
      '<a class="nav-link' + (activo ? ' active' : '') + '" href="' + p.href + '"' +
      (activo ? ' aria-current="page"' : '') + '>' + p.texto + '</a></li>';
  }).join('');

  var navbar =
    '<a class="gp-saltar" href="#contenido">Saltar al contenido</a>' +
    '<nav class="navbar navbar-expand-lg gp-navbar" data-bs-theme="dark" aria-label="Navegación principal">' +
    '<div class="container">' +
    '<a class="navbar-brand" href="index.html">Gastro<span>Pro</span></a>' +
    '<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#gp-menu" ' +
    'aria-controls="gp-menu" aria-expanded="false" aria-label="Abrir menú de navegación">' +
    '<span class="navbar-toggler-icon"></span>' +
    '</button>' +
    '<div class="collapse navbar-collapse" id="gp-menu">' +
    '<ul class="navbar-nav ms-auto">' + enlaces + '</ul>' +
    '</div>' +
    '</div>' +
    '</nav>';

  /* ---- Footer ---- */
  var enlacesFooter = PAGINAS.map(function (p) {
    return '<li><a href="' + p.href + '">' + p.texto + '</a></li>';
  }).join('');

  var horarios = SITIO.horarios.map(function (h) { return '<li>' + h + '</li>'; }).join('');

  var footer =
    '<div class="container">' +
    '<div class="row g-4">' +
    '<div class="col-md-6 col-lg-4">' +
    '<p class="gp-footer-marca mb-2">Gastro<span>Pro</span></p>' +
    '<p class="mb-0">' + SITIO.eslogan + '</p>' +
    '</div>' +
    '<div class="col-6 col-lg-2">' +
    '<h2>Navegación</h2><ul>' + enlacesFooter + '</ul>' +
    '</div>' +
    '<div class="col-6 col-lg-3">' +
    '<h2>Horarios</h2><ul>' + horarios + '</ul>' +
    '</div>' +
    '<div class="col-md-6 col-lg-3">' +
    '<h2>Contacto</h2>' +
    '<ul>' +
    '<li>' + SITIO.direccion + '</li>' +
    '<li><a href="tel:' + SITIO.telefono.replace(/\s/g, '') + '">' + SITIO.telefono + '</a></li>' +
    '<li><a href="mailto:' + SITIO.correo + '">' + SITIO.correo + '</a></li>' +
    '</ul>' +
    '</div>' +
    '</div>' +
    '<div class="gp-footer-base">&copy; ' + new Date().getFullYear() + ' ' + SITIO.nombre +
    '. Desarrollo Web.</div>' +
    '</div>';

  var elNavbar = document.getElementById('gp-navbar');
  var elFooter = document.getElementById('gp-footer');
  if (elNavbar) elNavbar.innerHTML = navbar;
  if (elFooter) elFooter.innerHTML = footer;
})();
