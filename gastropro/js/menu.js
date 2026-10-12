
document.addEventListener("DOMContentLoaded", () => {
   const botonesFiltro = document.querySelectorAll("#filtros-menu .nav-link");
   const platillos = document.querySelectorAll("#lista-platillos > [data-categoria]");

   botonesFiltro.forEach((boton) => {
      boton.addEventListener("click", () => {
         // 1. Quitar la clase active de todos los botones y ponerla en el cliqueado
         botonesFiltro.forEach((b) => b.classList.remove("active"));
         boton.classList.add("active");

         // 2. Obtener la categoría seleccionada
         const categoria = boton.getAttribute("data-categoria");

         // 3. Mostrar u ocultar elementos del menú
         platillos.forEach((platillo) => {
            const categoriaPlatillo = platillo.getAttribute("data-categoria");

            if (categoria === "todos" || categoriaPlatillo === categoria) {
               platillo.style.display = ""; // Muestra el elemento
            } else {
               platillo.style.display = "none"; // Oculta el elemento
            }
         });
      });
   });
});