<script setup lang="ts">
/**
 * Botón social animado al estilo Lottie, sin archivos JSON externos:
 *  - Entrada: el icono se "dibuja" trazo a trazo.
 *  - Hover / foco: relleno líquido que sube, el icono rebota (squash & stretch),
 *    se vuelve a dibujar y suelta un destello de partículas.
 *  - Salida: el líquido continúa hacia arriba y se vacía.
 * Con movimiento reducido solo cambia el color.
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { SocialLink } from '@/types'
import { socialIcons } from './socialIcons'
import { gsap, MQ } from '@/composables/useMotion'

const props = withDefaults(
  defineProps<{ link: SocialLink; size?: 'sm' | 'md' | 'lg'; tone?: 'dark' | 'light' }>(),
  { size: 'md', tone: 'dark' },
)

const shapes = computed(() => socialIcons[props.link.network])
const root = ref<HTMLAnchorElement | null>(null)
const icon = ref<SVGSVGElement | null>(null)
const liquid = ref<HTMLElement | null>(null)
const burst = ref<HTMLElement | null>(null)
const PARTICLES = 8

let mm: gsap.MatchMedia | undefined

/** Dibuja el icono desde cero (también lo usa la lista para la entrada en escena). */
function draw(delay = 0, duration = 0.9) {
  if (!icon.value) return
  const strokes = icon.value.querySelectorAll<SVGGeometryElement>('[data-stroke]')
  const dots = icon.value.querySelectorAll<SVGGeometryElement>('[data-dot]')
  strokes.forEach((el) => {
    const len = el.getTotalLength?.() ?? 60
    gsap.fromTo(
      el,
      { strokeDasharray: len, strokeDashoffset: len },
      { strokeDashoffset: 0, duration, delay, ease: 'power2.inOut' },
    )
  })
  gsap.fromTo(
    dots,
    { scale: 0, transformOrigin: '50% 50%' },
    { scale: 1, duration: 0.6, delay: delay + duration * 0.7, ease: 'back.out(3)' },
  )
}

defineExpose({ draw })

onMounted(() => {
  if (!root.value) return
  mm = gsap.matchMedia(root.value)
  mm.add(MQ.motion, () => {
    const node = root.value!
    const parts = burst.value!.children
    let tl: gsap.core.Timeline | undefined

    const enter = () => {
      tl?.kill()
      tl = gsap.timeline()
      tl.fromTo(
        liquid.value,
        { yPercent: 105 },
        { yPercent: 0, duration: 0.55, ease: 'power3.out' },
        0,
      )
        .fromTo(
          icon.value,
          { scaleX: 1, scaleY: 1 },
          {
            keyframes: [
              { scaleX: 1.28, scaleY: 0.78, duration: 0.12, ease: 'power2.out' },
              { scaleX: 0.86, scaleY: 1.18, y: -3, duration: 0.14, ease: 'power2.out' },
              { scaleX: 1, scaleY: 1, y: 0, duration: 0.6, ease: 'elastic.out(1.1, 0.35)' },
            ],
          },
          0,
        )
        .add(() => draw(0, 0.6), 0.05)
      Array.from(parts).forEach((p, i) => {
        const a = (i / PARTICLES) * Math.PI * 2 + Math.random() * 0.3
        const r = 26 + Math.random() * 10
        tl!.fromTo(
          p,
          { x: 0, y: 0, scale: 1, autoAlpha: 1 },
          {
            x: Math.cos(a) * r,
            y: Math.sin(a) * r,
            scale: 0,
            autoAlpha: 0,
            duration: 0.7,
            ease: 'expo.out',
          },
          0.08,
        )
      })
    }
    const leave = () => {
      gsap.to(liquid.value, {
        yPercent: -105,
        duration: 0.5,
        ease: 'power3.in',
        onComplete: () => {
          gsap.set(liquid.value, { yPercent: 105 })
        },
      })
    }
    gsap.set(liquid.value, { yPercent: 105 })
    node.addEventListener('pointerenter', enter)
    node.addEventListener('focus', enter)
    node.addEventListener('pointerleave', leave)
    node.addEventListener('blur', leave)
    return () => {
      tl?.kill()
      node.removeEventListener('pointerenter', enter)
      node.removeEventListener('focus', enter)
      node.removeEventListener('pointerleave', leave)
      node.removeEventListener('blur', leave)
    }
  })
})

onBeforeUnmount(() => mm?.revert())
</script>

<template>
  <a
    ref="root"
    :href="link.href"
    target="_blank"
    rel="noopener"
    class="sbtn"
    :class="[`sbtn--${size}`, `sbtn--${tone}`]"
    :aria-label="`${link.label} (se abre en una pestaña nueva)`"
  >
    <span class="sbtn-clip" aria-hidden="true">
      <span ref="liquid" class="sbtn-liquid" aria-hidden="true">
        <svg class="sbtn-wave" viewBox="0 0 120 12" preserveAspectRatio="none">
          <path d="M0 6 Q15 0 30 6 T60 6 T90 6 T120 6 V12 H0Z" />
        </svg>
      </span>
    </span>
    <span ref="burst" class="sbtn-burst" aria-hidden="true">
      <i v-for="n in PARTICLES" :key="n" />
    </span>
    <svg ref="icon" class="sbtn-icon" viewBox="0 0 24 24" aria-hidden="true">
      <component
        :is="s.tag"
        v-for="(s, i) in shapes"
        :key="i"
        v-bind="s.attrs"
        :data-stroke="s.fill ? undefined : ''"
        :data-dot="s.fill ? '' : undefined"
        :class="s.fill ? 'is-dot' : ''"
      />
    </svg>
    <span class="sbtn-tip" aria-hidden="true">{{ link.label }}</span>
  </a>
</template>

<style scoped>
.sbtn {
  --bd: rgb(255 255 255 / 0.22);
  --fg: var(--color-paper);
  --fg-hover: var(--color-ink);
  --liquid: var(--color-accent);
  position: relative;
  display: inline-grid;
  place-items: center;
  width: var(--s);
  height: var(--s);
  border-radius: 999px;
  border: 1px solid var(--bd);
  color: var(--fg);
  isolation: isolate;
  transition:
    color 0.35s ease,
    border-color 0.35s ease;
}
.sbtn--light {
  --bd: rgb(6 20 46 / 0.2);
  --fg: var(--color-ink);
  --fg-hover: var(--color-paper);
  --liquid: var(--color-blue);
}
.sbtn--sm {
  --s: 2.75rem;
  --i: 1.15rem;
}
.sbtn--md {
  --s: 3.25rem;
  --i: 1.3rem;
}
.sbtn--lg {
  --s: 3.9rem;
  --i: 1.55rem;
}
.sbtn-clip {
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  border-radius: inherit;
}
.sbtn-liquid {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: inherit;
  /* Estado inicial controlado por GSAP; ver bloque de movimiento reducido */
}
.sbtn-liquid::before {
  content: '';
  position: absolute;
  inset: 6px 0 0;
  background: var(--liquid);
}
.sbtn-wave {
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 7px;
  fill: var(--liquid);
  animation: wave 1.2s linear infinite;
}
@keyframes wave {
  to {
    transform: translateX(-50%);
  }
}
.sbtn-icon {
  width: var(--i);
  height: var(--i);
  overflow: visible;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.sbtn-icon .is-dot {
  fill: currentColor;
  stroke: none;
}
.sbtn-burst {
  position: absolute;
  inset: 50% auto auto 50%;
  pointer-events: none;
}
.sbtn-burst i {
  position: absolute;
  width: 5px;
  height: 5px;
  margin: -2.5px 0 0 -2.5px;
  border-radius: 50%;
  background: var(--liquid);
  opacity: 0;
}
.sbtn-burst i:nth-child(even) {
  width: 3px;
  height: 3px;
  margin: -1.5px 0 0 -1.5px;
  background: var(--color-accent-soft);
}
.sbtn-tip {
  position: absolute;
  bottom: calc(100% + 0.6rem);
  left: 50%;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  background: var(--color-paper);
  color: var(--color-ink);
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transform: translate(-50%, 6px);
  transition:
    opacity 0.3s ease,
    transform 0.5s var(--ease-out-expo);
}
.sbtn--light .sbtn-tip {
  background: var(--color-ink);
  color: var(--color-paper);
}
.sbtn:hover,
.sbtn:focus-visible {
  color: var(--fg-hover);
  border-color: var(--liquid);
}
.sbtn:hover .sbtn-tip,
.sbtn:focus-visible .sbtn-tip {
  opacity: 1;
  transform: translate(-50%, 0);
}
/* Sin animaciones: relleno inmediato */
@media (prefers-reduced-motion: reduce) {
  .sbtn-liquid {
    transform: translateY(105%);
  }
  .sbtn:hover .sbtn-liquid,
  .sbtn:focus-visible .sbtn-liquid {
    transform: none;
  }
  .sbtn-wave {
    animation: none;
  }
}
</style>
