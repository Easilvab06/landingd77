import { onBeforeUnmount, onMounted, type Ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'

gsap.registerPlugin(ScrollTrigger, SplitText, MotionPathPlugin)
gsap.defaults({ ease: 'expo.out', duration: 1.1 })

export { gsap, ScrollTrigger, SplitText }

/** Consultas de medios compartidas por todo el sistema de movimiento. */
export const MQ = {
  motion: '(prefers-reduced-motion: no-preference)',
  reduced: '(prefers-reduced-motion: reduce)',
  desktop: '(min-width: 1024px)',
  mobile: '(max-width: 1023.98px)',
  finePointer: '(hover: hover) and (pointer: fine)',
} as const

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(MQ.reduced).matches
}

/**
 * Ejecuta animaciones GSAP dentro de un contexto con alcance al componente.
 * Todo (tweens, ScrollTriggers, SplitText, matchMedia) se revierte al desmontar.
 * Si el usuario prefiere movimiento reducido, `setup` decide qué hacer vía `mm`.
 */
export function useGsap(
  scope: Ref<HTMLElement | null | undefined>,
  setup: (mm: gsap.MatchMedia, root: HTMLElement) => void,
) {
  let mm: gsap.MatchMedia | undefined
  onMounted(() => {
    const root = scope.value
    if (!root) return
    mm = gsap.matchMedia(root)
    try {
      setup(mm, root)
    } catch (err) {
      // Fallback: si algo falla, el contenido queda visible y sin animar.
      mm.revert()
      console.warn('[motion] animación omitida:', err)
    }
  })
  onBeforeUnmount(() => mm?.revert())
}

/**
 * Revelado de titulares línea a línea con máscara.
 * Se re-divide automáticamente al cambiar fuentes o tamaño de pantalla.
 */
export function revealLines(
  el: Element,
  opts: { delay?: number; trigger?: Element | false; start?: string; stagger?: number } = {},
) {
  return SplitText.create(el, {
    type: 'lines',
    mask: 'lines',
    linesClass: 'split-line',
    autoSplit: true,
    onSplit(self) {
      return gsap.from(self.lines, {
        yPercent: 115,
        rotate: 2.5,
        transformOrigin: '0% 100%',
        duration: 1.35,
        stagger: opts.stagger ?? 0.09,
        delay: opts.delay ?? 0,
        ease: 'expo.out',
        scrollTrigger:
          opts.trigger === false
            ? undefined
            : { trigger: opts.trigger ?? el, start: opts.start ?? 'top 86%', once: true },
      })
    },
  })
}

/** Entrada escalonada simple (fade + desplazamiento). */
export function fadeUp(
  targets: gsap.TweenTarget,
  trigger: Element,
  opts: { y?: number; stagger?: number; delay?: number; start?: string } = {},
) {
  return gsap.from(targets, {
    y: opts.y ?? 40,
    autoAlpha: 0,
    duration: 1.2,
    stagger: opts.stagger ?? 0.08,
    delay: opts.delay ?? 0,
    scrollTrigger: { trigger, start: opts.start ?? 'top 85%', once: true },
  })
}

/** Revelado de imagen mediante clip-path + contra-escala interna. */
export function revealImage(frame: Element, inner: Element | null, from = 'inset(100% 0% 0% 0%)') {
  const tl = gsap.timeline({ scrollTrigger: { trigger: frame, start: 'top 82%', once: true } })
  tl.fromTo(
    frame,
    { clipPath: from },
    { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut' },
  )
  if (inner) tl.from(inner, { scale: 1.35, duration: 2, ease: 'expo.out' }, 0.15)
  return tl
}

/** Parallax suave de una imagen dentro de su marco. */
export function parallax(target: Element, trigger: Element, amount = 12) {
  return gsap.fromTo(
    target,
    { yPercent: -amount / 2 },
    {
      yPercent: amount / 2,
      ease: 'none',
      scrollTrigger: { trigger, start: 'top bottom', end: 'bottom top', scrub: true },
    },
  )
}
