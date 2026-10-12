# GastroPro — base del proyecto

Sitio web de restaurante (HTML5, CSS3, Bootstrap 5 y JavaScript) con 4 páginas:
inicio, menú, pedidos para recoger y reservación de mesas.

## Estructura

```
gastropro/
├── index.html            Inicio
├── menu.html             Menú
├── pedidos.html          Pedidos para recoger
├── reservaciones.html    Reservar mesa
├── guia-estilos.html     Consulta de colores y componentes (borrar al entregar)
├── css/
│   ├── estilos.css       COMPARTIDO: colores, tipografía, navbar, footer, componentes
│   └── inicio.css · menu.css · pedidos.css · reservaciones.css   (uno por página)
├── js/
│   ├── componentes.js    COMPARTIDO: dibuja navbar y footer en todas las páginas
│   ├── main.js           COMPARTIDO: validación de formularios, avisos, moneda
│   └── menu.js · pedidos.js · reservaciones.js                   (uno por página)
└── img/                  Imágenes del sitio
```

## Reglas del equipo

1. **Cada quien trabaja en los archivos de su página** (el `.html`, su `css/` y el `js/` le toca a Samu jeje).
2. **No editar archivos compartidos** (`estilos.css`, `componentes.js`, `main.js`) sin avisar en el grupo. Si falta algo, se pide y se agrega para todos.
3. **Colores y fuentes solo con variables** `--gp-*` (por ejemplo `var(--gp-bosque)`). Nada de códigos de color escritos a mano.
4. **Primero Bootstrap**: grid (`container`, `row`, `col-*`), utilidades (`mb-3`, `d-flex`, `gap-3`)... Lo propio lleva el prefijo `gp-`.
5. **Navbar y footer no se copian**: se dibujan solos con `<header id="gp-navbar">` y `<footer id="gp-footer" class="gp-footer">`. Para cambiar enlaces, teléfono u horarios, editar `SITIO` y `PAGINAS` en `js/componentes.js`.
6. **Imágenes** en `img/`, con nombres en minúsculas y sin espacios (`tacos-pastor.jpg`) y siempre con `alt`.
7. Un solo `<h1>` por página; los formularios llevan `<label>` en cada campo.

## Qué trae cada página

| Página | Ya incluye | Falta (TODO) |
|---|---|---|
| Inicio | Hero, 3 platillos destacados, accesos a pedidos y reservaciones | Contenido real, ubicación, opiniones |
| Menú | Filtros por categoría, tarjetas de platillos | Todos los platillos y programar el filtro (`js/menu.js`) |
| Pedidos | Lista con cantidades, resumen, formulario validado | Calcular el total (`js/pedidos.js`) |
| Reservaciones | Formulario validado, fecha mínima = hoy, reglas | Ajustar reglas del restaurante |

## Funciones compartidas (js/main.js)

- `<form class="needs-validation" novalidate>`: muestra errores de Bootstrap y no ejecuta el código de la página si hay campos inválidos.
- `GastroPro.aviso('Mensaje', 'success' | 'danger' | 'warning' | 'info')`: muestra un aviso.
- `GastroPro.moneda(120)`: devuelve `$120.00`.
- `<input type="date" data-hoy-min>`: no permite fechas pasadas.

## Crear una página nueva

Copiar `index.html`, cambiar `<title>`, `data-pagina` y el contenido de `<main>`, y agregar la página a `PAGINAS` en `js/componentes.js`.

## Probarlo

Abrir `index.html` en el navegador (o con Live Server en VS Code). Requiere internet para cargar Bootstrap y las fuentes.
