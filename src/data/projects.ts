import type { Project } from '@/types'
import { images } from './images'

/**
 * PORTAFOLIO DE PROYECTOS
 * ------------------------------------------------------------
 * Para añadir un proyecto basta con agregar un objeto a esta lista:
 * los componentes se adaptan solos (portafolio, modal y galería).
 *
 * Reglas:
 *  - No escribas datos que no estén documentados: los campos opcionales
 *    (ubicación, potencia, resultados…) que queden vacíos no se muestran.
 *  - Las entradas actuales usan imágenes REFERENCIALES y nombres descriptivos
 *    del material visual, sin atribuirles cliente, ubicación ni cifras.
 *    Reemplázalas por tus proyectos reales.
 */
export const projects: Project[] = [
  {
    id: 'parque-solar-zona-agricola',
    name: 'Parque solar en zona agrícola',
    installationType: 'Generación solar a gran escala',
    cover: images.agriculturalAerial,
    gallery: [images.agriculturalAerial, images.sunsetAerial],
    layout: 'wide',
  },
  {
    id: 'planta-solar-montana',
    name: 'Planta solar en zona de montaña',
    installationType: 'Generación solar en terreno de ladera',
    cover: images.andeanPlant,
    gallery: [images.andeanPlant, images.engineers],
    layout: 'tall',
  },
  {
    id: 'cuarto-tecnico-conversion',
    name: 'Cuarto técnico de conversión y almacenamiento',
    installationType: 'Inversores, tableros y gabinetes de almacenamiento',
    cover: images.inverterRoom,
    gallery: [images.inverterRoom],
    layout: 'square',
  },
  {
    id: 'parque-solar-atardecer',
    name: 'Parque solar de gran escala',
    installationType: 'Generación solar en suelo',
    cover: images.sunsetAerial,
    gallery: [images.sunsetAerial, images.agriculturalAerial],
    layout: 'wide',
  },
]
