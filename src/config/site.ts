import type { ContactChannel, SocialLink } from '@/types'

/**
 * ============================================================
 *  CONFIGURACIÓN CENTRAL DEL SITIO
 *  Todo lo que se debe confirmar o reemplazar está aquí.
 *  Nada se inventa: los campos vacíos simplemente no se muestran.
 * ============================================================
 */
export const site = {
  /** Nombre de la empresa: aparece en el logotipo, textos, formulario y pie de página. */
  name: 'Tu Empresa',
  tagline: 'Ingeniería en energías renovables',
  description:
    'Diseñamos e implementamos soluciones de energía renovable para empresas, industrias y sectores productivos en Colombia.',

  /**
   * Logo oficial. Copia el archivo en /public (p. ej. /public/logo.svg)
   * y escribe aquí la ruta. Mientras esté vacío se usa el logotipo tipográfico.
   */
  logoSrc: '',
  /** Versión clara del logo para fondos oscuros (opcional). */
  logoSrcLight: '',

  /**
   * WhatsApp corporativo en formato internacional SIN "+" ni espacios.
   * Ejemplo: '573001234567'. Vacío = no se muestra el botón.
   */
  whatsapp: '',
  whatsappMessage: 'Hola, quiero recibir asesoría sobre una solución energética.',

  /** Canales confirmados. Deja la lista vacía hasta tener los datos oficiales. */
  channels: [
    // { type: 'phone', label: 'Teléfono', value: '+57 ...' },
    // { type: 'email', label: 'Correo', value: 'contacto@...' },
    // { type: 'address', label: 'Oficina', value: 'Ciudad, Colombia' },
  ] as ContactChannel[],

  /**
   * Redes sociales (botones animados del pie, contacto y menú móvil).
   * REEMPLAZA cada `href` por el perfil real de la empresa.
   * Para ocultar una red, elimina su línea. Redes disponibles:
   * instagram, facebook, linkedin, tiktok, youtube, x, whatsapp.
   * WhatsApp usa automáticamente el número de `whatsapp` si está definido.
   */
  social: [
    { network: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/' },
    { network: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/' },
    { network: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/' },
    { network: 'tiktok', label: 'TikTok', href: 'https://www.tiktok.com/' },
    { network: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/' },
    { network: 'whatsapp', label: 'WhatsApp', href: 'https://wa.me/' },
  ] as SocialLink[],

  /** Botón flotante de WhatsApp (abajo a la derecha). */
  whatsappFab: true,

  /** Enlaces legales cuando existan. */
  legal: [
    // { label: 'Política de tratamiento de datos', href: '/politica-de-datos.pdf' },
  ] as { label: string; href: string }[],

  /** URL de la política de datos que se enlaza en el consentimiento del formulario. */
  privacyPolicyUrl: '',

  /** Endpoint del formulario (definido en .env como VITE_FORM_ENDPOINT). */
  formEndpoint: import.meta.env.VITE_FORM_ENDPOINT ?? '',

  /** Coordenadas usadas por el indicador solar en vivo del hero (cámbialas por la sede de la empresa). */
  sunLocation: { label: 'Bogotá, Colombia', lat: 4.711, lon: -74.0721 },
}

export const navLinks = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'nosotros', label: 'Nosotros' },
  { id: 'soluciones', label: 'Soluciones' },
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'sostenibilidad', label: 'Sostenibilidad' },
  { id: 'contacto', label: 'Contacto' },
] as const

export function whatsappHref(message = site.whatsappMessage): string | null {
  if (!site.whatsapp) return null
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`
}

/** Redes con el enlace final resuelto (WhatsApp toma el número configurado). */
export function socialLinks(): SocialLink[] {
  return site.social.map((s) =>
    s.network === 'whatsapp' ? { ...s, href: whatsappHref() ?? s.href } : s,
  )
}
