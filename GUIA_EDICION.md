# Horizonte Temporal — Guía rápida de Pages CMS

## Dónde editar

1. Abre **https://app.pagescms.org/** e inicia sesión con tu cuenta de GitHub.
2. Selecciona el repositorio **prenuclear/horizonte-temporal** y la rama **main**.
3. Abre **«EDITAR HORIZONTE TEMPORAL — secciones en orden de la web»**.
4. Los apartados aparecen en el siguiente orden, de arriba hacia abajo. Abre cada apartado para editar sus campos y guarda los cambios.

## Apartados del CMS, en el mismo orden que el sitio

1. **ENCABEZADO Y NAVEGACIÓN** — nombre y enlaces del menú.
2. **PORTADA / INICIO** — logo, imagen, video y texto de presentación.
3. **01 / LA HISTORIA** — título, texto principal e imagen.
4. **CITA DESTACADA / IMAGEN Y TEXTO** — imagen detrás de la cita y sus tres textos.
5. **04 / ARCHIVO VISUAL — ENCABEZADO** — título y texto de presentación de la galería.
6. **ARCHIVO VISUAL — SIETE CAPÍTULOS Y TRES IMÁGENES CADA UNO** — abre el capítulo, luego cada una de las tres imágenes.
7. **05 / DETRÁS DE LAS IMÁGENES** — texto, URL del video e imagen de respaldo.
8. **06 / BITÁCORA — ENCABEZADO** — título y textos de la sección Noticias.
9. **BITÁCORA — NOTICIAS PUBLICADAS O EN BORRADOR** — noticias, imágenes, textos y enlaces.
10. **07 / EDICIÓN IMPRESA Y DÓNDE COMPRAR** — imagen de la publicación, precio, disponibilidad y tiendas.
11. **08 / CONTACTO Y REDES SOCIALES** — correo, presentación y redes.
12. **CIERRE DE LA PÁGINA** — imagen de fondo, logo y textos.
13. **PIE DE PÁGINA** — nombre y créditos del sitio.

Los capítulos y las noticias son listas plegables: se muestra un encabezado compacto y puedes abrir solo el que necesitas.

### Cómo cambiar la imagen de la cita

Abre **«CITA DESTACADA / IMAGEN Y TEXTO»**, situado justo después de **«01 / LA HISTORIA»**. En el campo **«CAMBIAR IMAGEN DE FONDO DE LA CITA»** selecciona un archivo de la biblioteca, sube uno nuevo o quita la selección para ocultar la imagen. Más abajo puedes editar el rótulo, la cita y el crédito.

### Cómo cambiar imágenes de la galería

Abre **«ARCHIVO VISUAL — SIETE CAPÍTULOS Y TRES IMÁGENES CADA UNO»**. Expande el capítulo que quieres actualizar y, dentro de él, la imagen correspondiente. Puedes cambiar o quitar una imagen sin modificar el resto del capítulo.

### Lo que se retiró del editor

Se retiraron los campos de las secciones eliminadas (Estructura narrativa y Atlas), el grupo global de 45 textos mezclados, las escenas del antiguo explorador cinematográfico que ya no se muestra y las opciones de contenido sin uso. Sus valores no se perdieron: todos los textos visibles se migraron a su apartado y existe un respaldo de los datos anteriores en `respaldo-contenido-2026-10-28.json`.

Los siete capítulos de galería y las noticias se conservan. El respaldo también contiene las antiguas sinopsis e imágenes del explorador, para recuperarlas si se vuelve a utilizar ese formato.

## ¿No aparece la nueva organización?

Comprueba que estás en **prenuclear/horizonte-temporal**, rama **main**, y que abriste el documento **«EDITAR HORIZONTE TEMPORAL — secciones en orden de la web»**. Recarga Pages CMS con Ctrl + F5 o vuelve a abrir el repositorio. El CMS lee `.pages.yml` de la rama seleccionada.

Guardar en Pages CMS actualiza el repositorio GitHub. Netlify publicará los cambios si está conectado a esa rama. Las imágenes se almacenan en `images`; quitarlas de una sección no borra el archivo físico.

*Actualizado: 28 de octubre de 2026.*
