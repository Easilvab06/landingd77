# Landing page — Energías renovables

Vue 3 + TypeScript + Vite 7 + Tailwind CSS 4 + GSAP (ScrollTrigger y SplitText) + Lenis + Lucide.

## Puesta en marcha

Requisitos: **Node.js 20.19+ o 22.12+**.

```bash
npm install
npm run dev        # desarrollo en http://localhost:5173
npm run build      # verificación de tipos + compilación a /dist
npm run preview    # sirve la versión compilada
npm run lint       # ESLint
npm run format     # Prettier
```

`/dist` es estático: se publica en Netlify, Vercel, Cloudflare Pages, Hostinger o cualquier hosting.

## Lo que debes completar (nada se inventó)

El sitio es una plantilla sin marca: el nombre “Tu Empresa” se cambia en una sola línea (`name` en `src/config/site.ts`) y se refleja en logotipo, textos, formulario y pie de página. La paleta es solo azul y blanco (tokens en `src/styles/main.css`, bloque `@theme`).


Todo está centralizado y los campos vacíos simplemente no se muestran.

| Qué | Dónde |
| --- | --- |
| Logo oficial | Copia el archivo a `public/` y escribe la ruta en `logoSrc` / `logoSrcLight` de `src/config/site.ts` |
| WhatsApp, teléfono, correo, dirección | `whatsapp` y `channels` en `src/config/site.ts` |
| Redes sociales | `social` en `src/config/site.ts` — reemplaza cada `href` (ahora apuntan a la página principal de cada red); borra una línea para ocultar esa red |
| Botón flotante de WhatsApp | `whatsapp` (número) y `whatsappFab` en `src/config/site.ts` |
| Enlaces legales | `legal`, `privacyPolicyUrl` en `src/config/site.ts` |
| Envío del formulario | Copia `.env.example` a `.env` y define `VITE_FORM_ENDPOINT` (p. ej. Formspree). Sin endpoint, el formulario avisa que **no** se envió |
| Servicios | `src/data/solutions.ts` — Mantenimiento y Movilidad eléctrica están en `confirmed: false` (ocultos) hasta confirmar que hacen parte de la oferta |
| Proyectos reales | `src/data/projects.ts` — nombre, ubicación, potencia, descripción, resultados y galería. Los campos vacíos no aparecen |
| Ubicación del indicador solar | `sunLocation` en `src/config/site.ts` |
| Título, descripción, dominio y nombre para SEO | `index.html` (`<title>`, `og:site_name`, `canonical`, JSON-LD) |

## Imágenes

- Optimizadas en `public/images/` en AVIF, WebP y JPG a varios anchos (`srcset` automático).
- Originales intactos en `assets-originales/`.
- La imagen de **Bombeo solar** (riego por aspersión) se sirve desde el CDN de Unsplash ([foto de Being Organic in EU](https://unsplash.com/photos/two-sprinklers-spraying-water-on-a-corn-field-ZYiOik4jels), licencia gratuita de Unsplash) mediante el campo `remote` de `src/data/images.ts`. Si prefieres alojarla tú, descárgala, genera las variantes y quita `remote`.
- Catálogo, textos alternativos y puntos focales: `src/data/images.ts`.
- Todas están marcadas como **referenciales** (tres generadas con IA y dos de aspecto de banco de imágenes) y muestran la etiqueta “Imagen referencial”. Al cambiarlas por fotos reales de la empresa pon `referential: false`.

Para generar variantes de una foto nueva (con Python + Pillow):

```bash
python3 -c "
from PIL import Image; import sys
src, name = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGB'); w0, h0 = im.size
for w in [x for x in (480, 800, 1200, 1600, 2120) if x <= w0]:
    r = im.resize((w, round(h0*w/w0)), Image.LANCZOS)
    for ext, q in (('avif', 55), ('webp', 78), ('jpg', 80)):
        r.save(f'public/images/{name}-{w}.{ext}', quality=q)
" foto-original.jpg mi-proyecto
```

Luego registra la imagen en `src/data/images.ts` con sus `widths`.

## Arquitectura

```
src/
  config/site.ts            Datos de la empresa (único lugar a editar)
  data/                     Imágenes, soluciones y proyectos
  composables/
    useMotion.ts            GSAP: contextos, matchMedia, revelados, parallax
    useSmoothScroll.ts      Lenis + ScrollTrigger + anclas accesibles
    useSunPosition.ts       Cálculo astronómico del sol en tiempo real
    useActiveSection.ts     Sección activa del menú
  components/
    layout/                 Cabecera, pie, telón de apertura, barra de progreso
    hero/                   Corrientes de energía (canvas) e instrumento solar
    sections/               Las secciones de la página
    ui/                     Botón magnético, imagen responsiva, logotipo
```

## Movimiento y accesibilidad

- Cada componente crea sus animaciones dentro de `gsap.matchMedia()` y las revierte al desmontarse.
- Con `prefers-reduced-motion: reduce` no hay telón, Lenis, canvas ni animaciones: todo el contenido es visible y la galería de proyectos se recorre con scroll horizontal nativo.
- Nada se oculta antes de cargar; si una animación falla, el contenido queda visible.
- Menú móvil con trampa de foco y Escape; ficha de proyecto sobre `<dialog>` nativo; formulario con errores asociados por `aria-describedby`; enlace “Saltar al contenido”.
- Contrastes: el azul claro de acento se usa sobre fondos oscuros; en fondos claros los acentos pasan a azul intenso.

## Detalles

- **Indicador “Sol en vivo”**: elevación, amanecer y atardecer calculados en el navegador para la ubicación configurada (sin APIs ni datos inventados).
- **Corrientes de energía**: canvas ligero que se pausa fuera de pantalla y reacciona al puntero.
- **Franja de valores**: cinta que acelera y cambia de dirección según la velocidad del scroll.
- **Proyectos**: galería horizontal fijada con parallax interno y ficha con galería.
- **CTA**: ventana que se abre hasta llenar la pantalla con el scroll.
- **Botones sociales estilo Lottie** (`SocialButton.vue`): el icono se dibuja trazo a trazo al aparecer; al pasar el cursor sube un relleno líquido con ola, el icono rebota con squash & stretch, se redibuja y suelta un destello de partículas. Hechos con SVG + GSAP, sin archivos JSON ni librerías extra. Están en el pie, en Contacto y en el menú móvil.
- **WhatsApp flotante** (`WhatsAppFab.vue`): aparece tras el hero con un pop elástico, emite ondas de pulso y despliega “¿Hablamos?”.

## Despliegue en GitHub Pages (subruta `/landingd77/`)

- `vite.config.ts` define `base: '/landingd77/'`. Si cambias el nombre del repositorio, actualiza ese valor.
- Nunca escribas rutas a mano como `/images/...`. En código usa `import.meta.env.BASE_URL`
  y en `index.html` usa `%BASE_URL%` (Vite no reescribe atributos como `imagesrcset`).
- `og:image` debe ser una URL absoluta: actualízala cuando tengas tu dominio definitivo.
- Compilar: `npm ci && npm run build` y publicar la carpeta `dist/`.
