import type { SocialNetwork } from '@/types'

/**
 * Iconos de redes en trazo (viewBox 24×24), dibujados para poder animarse
 * como un Lottie: cada forma se "escribe" con stroke-dashoffset.
 */
export interface IconShape {
  tag: 'path' | 'rect' | 'circle'
  attrs: Record<string, string | number>
  /** Las formas "fill" se rellenan en vez de dibujarse (puntos pequeños). */
  fill?: boolean
}

export const socialIcons: Record<SocialNetwork, IconShape[]> = {
  instagram: [
    { tag: 'rect', attrs: { x: 3, y: 3, width: 18, height: 18, rx: 5.2 } },
    { tag: 'circle', attrs: { cx: 12, cy: 12, r: 4.1 } },
    { tag: 'circle', attrs: { cx: 17.3, cy: 6.7, r: 1.05 }, fill: true },
  ],
  facebook: [
    { tag: 'path', attrs: { d: 'M15.5 3.5h-2.4A3.6 3.6 0 0 0 9.5 7.1V21' } },
    { tag: 'path', attrs: { d: 'M6.5 10.5h8.3' } },
  ],
  linkedin: [
    { tag: 'rect', attrs: { x: 3, y: 3, width: 18, height: 18, rx: 3.2 } },
    { tag: 'path', attrs: { d: 'M8 10.5V17' } },
    { tag: 'circle', attrs: { cx: 8, cy: 7.4, r: 1.05 }, fill: true },
    { tag: 'path', attrs: { d: 'M11.6 17v-6.5M11.6 13.4a2.7 2.7 0 0 1 5.4 0V17' } },
  ],
  tiktok: [
    { tag: 'path', attrs: { d: 'M13.6 3v11.6a3.6 3.6 0 1 1-3.6-3.6' } },
    { tag: 'path', attrs: { d: 'M13.6 3c.4 2.6 2.3 4.5 5.2 4.8' } },
  ],
  youtube: [
    { tag: 'rect', attrs: { x: 2.5, y: 5.5, width: 19, height: 13, rx: 4 } },
    { tag: 'path', attrs: { d: 'M10.2 9.3v5.4l4.6-2.7z' } },
  ],
  x: [
    { tag: 'path', attrs: { d: 'M4 4l16 16' } },
    { tag: 'path', attrs: { d: 'M20 4l-6.7 6.7M10.7 13.3L4 20' } },
  ],
  whatsapp: [
    { tag: 'path', attrs: { d: 'M3.6 20.4l1.2-4.1A8.6 8.6 0 1 1 8 19.5z' } },
    {
      tag: 'path',
      attrs: {
        d: 'M9.1 8.2c-.3 0-.8.3-.8 1.2 0 2.4 3.7 6.2 6.3 6.2.8 0 1.2-.5 1.2-.8v-.9l-1.9-.9-.8.9c-1-.4-2.1-1.4-2.6-2.5l.9-.8-.8-1.9z',
      },
    },
  ],
}
