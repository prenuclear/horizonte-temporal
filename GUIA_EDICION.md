# Horizonte Temporal — Guía de edición

La web se administra en https://pagescms.org/ usando GitHub `prenuclear/horizonte-temporal`.

## Galería: siete capítulos, tres imágenes cada uno

1. Abrir «Contenidos de Horizonte Temporal» → «Siete capítulos».
2. Seleccionar un capítulo y buscar «Galería de este capítulo».
3. Editar sus tres elementos: «Imagen de la galería» y «Pie de foto».
4. Para cambiar una imagen, elegir otra en la biblioteca de Pages CMS o subir un archivo.
5. Para retirar una imagen, borrar su elemento de la lista o vaciar su campo. La web no muestra espacios en blanco.
6. Mostrar un máximo de tres imágenes por capítulo. Si necesitas más, ajustaremos el diseño.

Hay 21 posiciones iniciales pero 13 imágenes distintas. Algunas se repiten temporalmente para permitir su reemplazo más adelante.

## Resto de las imágenes

- Portada: «Portada - imagen de fondo», «Logo de portada» y «Portada - imagen de respaldo del video».
- Historia: «Historia - imagen principal».
- Fragmento: «Fragmento - imagen de fondo».
- Capítulos: «Capítulo - imagen protagonista», escenas e imágenes de galería.
- Detrás de las imágenes: «imagen de portada del video»; el propio video se cambia por URL.
- Noticias: cada noticia tiene «Imagen de la noticia».
- Dónde comprar: «Imagen de la edición impresa».
- Cierre: «Cierre - imagen de fondo» y «Cierre - logo», independiente del de portada.

Una imagen vacía se oculta en el sitio. Si un video sigue activo, puede verse sobre la imagen de fondo, aunque esta se haya retirado.

## Textos

Los textos de portada, Historia, Proceso, capítulos, galería, noticias, compra y contacto se encuentran en sus campos habituales. Los encabezados, menús, rótulos, mensajes cortos y pie de página están agrupados bajo «Textos y rótulos de todas las secciones».

Dejar vacío un texto opcional lo oculta. En algunos títulos se usa `[palabra]` para resaltar esa palabra en color; puedes modificar o retirar los corchetes. Usa un salto de línea si quieres dividir el título en dos líneas.

Las imágenes existentes se conservan en la carpeta `images`. Eliminar una imagen del sitio no borra su archivo de GitHub.

## Publicar

Guardar los cambios en Pages CMS crea una modificación en GitHub. Si Netlify está conectado a la rama `main`, publicará la actualización automáticamente. Tras el despliegue, usar Ctrl+F5 para comprobar los cambios.

Fecha de reorganización: 28 de octubre de 2026.

## Nota de estructura (28 de octubre de 2026)

Se retiró la sección duplicada «02 / ESTRUCTURA NARRATIVA» y su acceso del menú. Los siete capítulos y sus galerías de tres imágenes siguen funcionando dentro de «04 / ARCHIVO VISUAL»; todos son editables desde Pages CMS. Las escenas del explorador cinematográfico anterior permanecen preservadas dentro de `contenido.json`, pero no se muestran en la web ni como campos de edición porque esa sección se retiró. Los números de las demás secciones se conservan por ahora.

## Sección Atlas retirada

Se eliminó «03 / ATLAS DEL UNIVERSO» y sus tres fichas de la web y de Pages CMS. Se conservan «04 / ARCHIVO VISUAL», sus siete capítulos y las tres imágenes de cada capítulo. Los archivos de imagen compartidos con otras secciones permanecen en el repositorio. Los números de las secciones restantes se mantienen.

## Editar la imagen detrás de la cita

En Pages CMS, abre `Contenidos de Horizonte Temporal` y el primer apartado **«CITA DESTACADA — imagen de fondo y textos»**. En **«IMAGEN DE LA CITA — cambiar, subir o quitar»**, elige una imagen de la biblioteca o súbela. Si vacías el campo, se oculta la imagen. En este mismo apartado también puedes editar los textos superior, principal e inferior de la cita.
