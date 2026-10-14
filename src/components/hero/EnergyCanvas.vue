<script setup lang="ts">
/**
 * Capa de "corrientes de energía": haces de luz azul que recorren la escena
 * siguiendo la dirección de las filas de paneles. Canvas 2D ligero:
 * - DPR limitado a 1.5, densidad según el ancho de pantalla.
 * - Se pausa fuera de pantalla y con la pestaña oculta.
 * - No se ejecuta con movimiento reducido.
 * - Reacciona sutilmente al puntero (atracción de luz).
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { prefersReducedMotion } from '@/composables/useMotion'

const canvas = ref<HTMLCanvasElement | null>(null)

interface Streak {
  x: number
  y: number
  len: number
  speed: number
  life: number
  max: number
  width: number
  hue: number
}

let raf = 0
let running = false
let io: IntersectionObserver | undefined
let cleanup: (() => void) | undefined

onMounted(() => {
  const el = canvas.value
  if (!el || prefersReducedMotion()) return
  const ctx = el.getContext('2d')
  if (!ctx) return

  const angle = (-32 * Math.PI) / 180
  const dx = Math.cos(angle)
  const dy = Math.sin(angle)
  let w = 0
  let h = 0
  let dpr = 1
  let streaks: Streak[] = []
  const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999 }

  const spawn = (initial = false): Streak => ({
    x: Math.random() * w * 1.2 - w * 0.2,
    y: initial ? Math.random() * h : h * (0.35 + Math.random() * 0.75),
    len: 40 + Math.random() * 160,
    speed: 0.6 + Math.random() * 1.8,
    life: 0,
    max: 160 + Math.random() * 260,
    width: Math.random() < 0.15 ? 1.6 : 0.8,
    hue: 212 + Math.random() * 14,
  })

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    w = el.clientWidth
    h = el.clientHeight
    el.width = Math.round(w * dpr)
    el.height = Math.round(h * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    const count = Math.round(Math.min(70, Math.max(22, w / 22)))
    streaks = Array.from({ length: count }, () => spawn(true))
  }

  const frame = () => {
    if (!running) return
    ctx.clearRect(0, 0, w, h)
    ctx.globalCompositeOperation = 'lighter'
    pointer.x += (pointer.tx - pointer.x) * 0.08
    pointer.y += (pointer.ty - pointer.y) * 0.08

    for (let i = 0; i < streaks.length; i++) {
      const s = streaks[i]!
      s.life++
      s.x += dx * s.speed
      s.y += dy * s.speed
      // Atracción suave hacia el puntero
      const px = pointer.x - s.x
      const py = pointer.y - s.y
      const dist = Math.hypot(px, py)
      let boost = 0
      if (dist < 220) {
        boost = 1 - dist / 220
        s.x += (px / dist) * boost * 0.6
        s.y += (py / dist) * boost * 0.6
      }
      const t = s.life / s.max
      const fade = Math.sin(Math.min(1, t) * Math.PI)
      const alpha = 0.32 * fade + boost * 0.35
      const x2 = s.x - dx * s.len
      const y2 = s.y - dy * s.len
      const grad = ctx.createLinearGradient(s.x, s.y, x2, y2)
      grad.addColorStop(0, `hsla(${s.hue}, 95%, 70%, ${alpha})`)
      grad.addColorStop(1, `hsla(${s.hue}, 95%, 70%, 0)`)
      ctx.strokeStyle = grad
      ctx.lineWidth = s.width + boost * 0.8
      ctx.beginPath()
      ctx.moveTo(s.x, s.y)
      ctx.lineTo(x2, y2)
      ctx.stroke()
      // Cabeza luminosa
      ctx.fillStyle = `hsla(${s.hue}, 100%, 92%, ${alpha * 1.4})`
      ctx.beginPath()
      ctx.arc(s.x, s.y, s.width * 0.9 + boost, 0, Math.PI * 2)
      ctx.fill()
      if (s.life > s.max || s.y < -20 || s.x > w + 200) streaks[i] = spawn()
    }
    raf = requestAnimationFrame(frame)
  }

  const start = () => {
    if (running) return
    running = true
    raf = requestAnimationFrame(frame)
  }
  const stop = () => {
    running = false
    cancelAnimationFrame(raf)
  }

  const onMove = (e: PointerEvent) => {
    const r = el.getBoundingClientRect()
    pointer.tx = e.clientX - r.left
    pointer.ty = e.clientY - r.top
  }
  const onLeave = () => {
    pointer.tx = -9999
    pointer.ty = -9999
  }
  const onVis = () => (document.hidden ? stop() : start())

  resize()
  const ro = new ResizeObserver(resize)
  ro.observe(el)
  io = new IntersectionObserver(([entry]) => (entry?.isIntersecting ? start() : stop()))
  io.observe(el)
  const host = el.parentElement!
  host.addEventListener('pointermove', onMove)
  host.addEventListener('pointerleave', onLeave)
  document.addEventListener('visibilitychange', onVis)

  cleanup = () => {
    stop()
    ro.disconnect()
    io?.disconnect()
    host.removeEventListener('pointermove', onMove)
    host.removeEventListener('pointerleave', onLeave)
    document.removeEventListener('visibilitychange', onVis)
  }
})

onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <canvas
    ref="canvas"
    class="pointer-events-none absolute inset-0 h-full w-full"
    aria-hidden="true"
  />
</template>
