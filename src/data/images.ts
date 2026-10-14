import type { ImageAsset } from '@/types'

/**
 * Catálogo de imágenes optimizadas (AVIF / WebP / JPG en /public/images).
 * Los originales sin modificar están en /assets-originales.
 *
 * IMPORTANTE: todas las imágenes actuales están marcadas como `referential`
 * porque no se ha confirmado que correspondan a instalaciones de la empresa
 * (tres fueron generadas con IA y dos parecen fotografías de banco).
 * Cuando subas fotos reales de tus proyectos, regenera las variantes
 * (ver README) y cambia `referential` a false.
 */

export const images = {
  /** Vista aérea al atardecer, filas de paneles con reflejos dorados. 2121×1414. Uso: HERO. */
  sunsetAerial: {
    name: 'parque-solar-atardecer-aereo',
    alt: 'Vista aérea de un parque solar al atardecer, con filas de paneles que reflejan la luz dorada del sol',
    width: 2121,
    height: 1414,
    widths: [480, 800, 1200, 1600, 2120],
    color: '#6f6e68',
    focus: '60% 55%',
    focusMobile: '72% 60%',
    referential: true,
  },
  /**
   * Riego por aspersión en un cultivo. Unsplash (licencia gratuita de Unsplash),
   * servida desde su CDN. Uso: BOMBEO / RIEGO SOLAR.
   */
  solarIrrigation: {
    name: 'riego-aspersion-cultivo',
    remote: 'https://images.unsplash.com/photo-1738598665698-7fd7af4b5e0c',
    alt: 'Aspersores regando un cultivo verde a pleno sol',
    width: 1600,
    height: 1067,
    widths: [480, 800, 1200, 1600, 2000],
    color: '#5f7a4a',
    focus: '50% 55%',
    focusMobile: '50% 55%',
    referential: true,
    credit: {
      author: 'Being Organic in EU',
      href: 'https://unsplash.com/photos/two-sprinklers-spraying-water-on-a-corn-field-ZYiOik4jels',
      source: 'Unsplash',
    },
  },
  /** Planta solar entre montañas andinas al amanecer. 1376×768 (generada con IA). */
  andeanPlant: {
    name: 'planta-solar-montana-andina',
    alt: 'Planta solar instalada en un valle montañoso con vegetación tropical al amanecer',
    width: 1376,
    height: 768,
    widths: [480, 800, 1200, 1376],
    color: '#6c7375',
    focus: '50% 60%',
    focusMobile: '62% 70%',
    referential: true,
  },
  /** Parque solar rodeado de cultivos, toma aérea gran angular. 1200×700. */
  agriculturalAerial: {
    name: 'parque-solar-zona-agricola-aereo',
    alt: 'Toma aérea de un parque solar rodeado de cultivos y vegetación en una zona agrícola',
    width: 1200,
    height: 700,
    widths: [480, 800, 1200],
    color: '#81896f',
    focus: '45% 55%',
    focusMobile: '45% 55%',
    referential: true,
  },
  /** Dos ingenieros revisando planos en campo junto a una planta solar. 1376×768 (generada con IA). */
  engineers: {
    name: 'ingenieros-planificacion-campo',
    alt: 'Dos ingenieros con casco revisan planos eléctricos y una tableta junto a una planta solar',
    width: 1376,
    height: 768,
    widths: [480, 800, 1200, 1376],
    color: '#787a75',
    focus: '50% 40%',
    focusMobile: '55% 35%',
    referential: true,
  },
  /** Cuarto técnico con inversores, gabinetes de baterías y tableros. 1376×768 (generada con IA). */
  inverterRoom: {
    name: 'cuarto-inversores-baterias',
    alt: 'Cuarto técnico con inversores solares, gabinetes de almacenamiento y cableado organizado',
    width: 1376,
    height: 768,
    widths: [480, 800, 1200, 1376],
    color: '#606262',
    focus: '65% 50%',
    focusMobile: '70% 50%',
    referential: true,
  },
} satisfies Record<string, ImageAsset>
