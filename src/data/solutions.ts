import type { Solution } from '@/types'
import { images } from './images'

/**
 * Portafolio de soluciones.
 * `confirmed: false` = servicio pendiente de confirmar en la oferta vigente;
 * NO se muestra en la web hasta cambiarlo a `true`.
 */
const all: Solution[] = [
  {
    id: 'fotovoltaica',
    title: 'Energía solar fotovoltaica',
    short: 'Generación eléctrica solar',
    description:
      'Diseño e implementación de soluciones de generación eléctrica solar, dimensionadas según el consumo y las condiciones de cada operación.',
    image: images.sunsetAerial,
    icon: 'sun',
    confirmed: true,
  },
  {
    id: 'bombeo',
    title: 'Bombeo solar',
    short: 'Agua impulsada por el sol',
    description:
      'Soluciones de bombeo para aplicaciones agrícolas, ganaderas y de abastecimiento de agua, según los requerimientos de cada proyecto.',
    image: images.solarIrrigation,
    icon: 'droplets',
    confirmed: true,
  },
  {
    id: 'riego',
    title: 'Riego y productividad agrícola',
    short: 'Energía para el campo',
    description:
      'Integración de energía solar con sistemas de riego y con las necesidades operativas del sector productivo.',
    image: images.agriculturalAerial,
    icon: 'sprout',
    confirmed: true,
  },
  {
    id: 'consultoria',
    title: 'Consultoría e ingeniería energética',
    short: 'Decisiones con criterio técnico',
    description:
      'Acompañamiento técnico para evaluar oportunidades de eficiencia energética y de generación renovable.',
    image: images.engineers,
    icon: 'compass',
    confirmed: true,
  },
  {
    id: 'mantenimiento',
    title: 'Mantenimiento y monitoreo fotovoltaico',
    short: 'Sistemas que rinden en el tiempo',
    description: 'Servicios de supervisión, inspección y mantenimiento de sistemas fotovoltaicos.',
    image: images.inverterRoom,
    icon: 'activity',
    confirmed: false, // ← cambia a true si está dentro del portafolio
  },
  {
    id: 'movilidad',
    title: 'Movilidad eléctrica',
    short: 'Infraestructura de carga',
    description: 'Soluciones relacionadas con infraestructura de carga para vehículos eléctricos.',
    icon: 'plug',
    confirmed: false, // ← cambia a true si forma parte de la oferta vigente (añade una imagen)
  },
]

export const solutions = all.filter((s) => s.confirmed)
