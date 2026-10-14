import Lenis from 'lenis'
import { gsap, ScrollTrigger, prefersReducedMotion } from './useMotion'

/**
 * Desplazamiento suave con Lenis sincronizado con ScrollTrigger.
 * - Solo se activa si el usuario NO prefiere movimiento reducido.
 * - No secuestra el teclado ni el scroll táctil nativo (syncTouch: false).
 */
let lenis: Lenis | null = null
let tick: ((time: number) => void) | null = null

export function initSmoothScroll() {
  if (lenis || prefersReducedMotion()) return
  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    syncTouch: false,
    anchors: false,
  })
  lenis.on('scroll', ScrollTrigger.update)
  tick = (time) => lenis?.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
}

export function destroySmoothScroll() {
  if (tick) gsap.ticker.remove(tick)
  lenis?.destroy()
  lenis = null
  tick = null
}

export function headerOffset(): number {
  return -(document.querySelector<HTMLElement>('[data-site-header]')?.offsetHeight ?? 72) + 1
}

/** Desplaza a una sección por id respetando la cabecera fija y el foco accesible. */
export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const focusTarget = () => {
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
    el.focus({ preventScroll: true })
  }
  if (lenis) {
    lenis.scrollTo(el, {
      offset: id === 'inicio' ? 0 : headerOffset(),
      duration: 1.6,
      onComplete: focusTarget,
    })
  } else {
    const behavior: ScrollBehavior = prefersReducedMotion() ? 'auto' : 'smooth'
    const top =
      id === 'inicio' ? 0 : el.getBoundingClientRect().top + window.scrollY + headerOffset()
    window.scrollTo({ top, behavior })
    focusTarget()
  }
  history.replaceState(null, '', id === 'inicio' ? location.pathname : `#${id}`)
}

export function stopScroll() {
  lenis?.stop()
  document.documentElement.style.overflow = 'hidden'
}

export function startScroll() {
  lenis?.start()
  document.documentElement.style.overflow = ''
}

/** Delegación global: todos los enlaces internos #id usan el scroll del sistema. */
export function handleAnchorClick(e: MouseEvent) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return
  const a = (e.target as HTMLElement | null)?.closest('a[href^="#"]') as HTMLAnchorElement | null
  if (!a) return
  const id = a.getAttribute('href')!.slice(1)
  if (!id || !document.getElementById(id)) return
  e.preventDefault()
  scrollToId(id)
}
