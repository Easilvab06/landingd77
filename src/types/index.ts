export interface ImageAsset {
  /** Nombre base del archivo en /public/images (sin ancho ni extensión). */
  name: string
  alt: string
  width: number
  height: number
  /** Anchos disponibles generados para srcset. */
  widths: number[]
  /**
   * URL base de una imagen remota (p. ej. https://images.unsplash.com/photo-...).
   * Si existe, las variantes se piden al CDN en lugar de /public/images.
   */
  remote?: string
  /** Crédito de la fotografía (autor y enlace), cuando corresponda. */
  credit?: { author: string; href: string; source: string }
  /** Color dominante para el placeholder mientras carga. */
  color: string
  /** Punto focal para object-position (desktop y móvil). */
  focus?: string
  focusMobile?: string
  /**
   * true = imagen de referencia (stock o generada), NO es una instalación real
   * de la empresa. Se muestra la etiqueta "Imagen referencial".
   */
  referential?: boolean
}

export interface Solution {
  id: string
  title: string
  short: string
  description: string
  image?: ImageAsset
  icon: 'sun' | 'droplets' | 'sprout' | 'plug' | 'activity' | 'compass'
  /**
   * false = el servicio aún debe confirmarse dentro del portafolio vigente.
   * Mientras sea false NO se muestra en la web.
   */
  confirmed: boolean
}

export interface ProjectSpec {
  label: string
  value: string
}

export interface Project {
  id: string
  name: string
  /** Solo si está documentada. */
  location?: string
  /** Solo si está documentado. */
  installationType?: string
  /** Solo si está documentada, p. ej. "1,2 MWp". */
  power?: string
  description?: string
  /** Resultados reales verificados. */
  results?: string[]
  cover: ImageAsset
  gallery: ImageAsset[]
  /** Proporción de la tarjeta en el portafolio. */
  layout: 'wide' | 'tall' | 'square'
}

export interface ContactChannel {
  type: 'whatsapp' | 'phone' | 'email' | 'address'
  label: string
  value: string
}

export type SocialNetwork =
  'instagram' | 'facebook' | 'linkedin' | 'tiktok' | 'youtube' | 'x' | 'whatsapp'

export interface SocialLink {
  network: SocialNetwork
  label: string
  href: string
}
