<script setup lang="ts">
/**
 * Franja de valor: cinta tipográfica infinita cuya velocidad y dirección
 * responden a la velocidad de desplazamiento. Con movimiento reducido
 * se muestra como una lista estática.
 */
import { ref } from 'vue'
import { gsap, MQ, ScrollTrigger, useGsap } from '@/composables/useMotion'

const values = [
  { a: 'Ingeniería', b: 'especializada' },
  { a: 'Eficiencia', b: 'energética' },
  { a: 'Soluciones', b: 'a la medida' },
  { a: 'Compromiso con la', b: 'sostenibilidad' },
]

const root = ref<HTMLElement | null>(null)
const track = ref<HTMLElement | null>(null)

useGsap(root, (mm) => {
  mm.add(MQ.motion, () => {
    const loop = gsap.to(track.value, { xPercent: -50, duration: 38, ease: 'none', repeat: -1 })
    let dir = 1
    const st = ScrollTrigger.create({
      trigger: root.value,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate(self) {
        const v = self.getVelocity()
        dir = v < 0 ? -1 : 1
        const boost = Math.min(5, 1 + Math.abs(v) / 450)
        gsap.to(loop, { timeScale: dir * boost, duration: 0.25, overwrite: true })
        gsap.to(loop, { timeScale: dir, duration: 1.4, delay: 0.25, ease: 'power2.out' })
      },
    })
    gsap.from(root.value!.querySelectorAll('[data-rule]'), {
      scaleX: 0,
      duration: 1.6,
      ease: 'expo.inOut',
      scrollTrigger: { trigger: root.value, start: 'top 90%', once: true },
    })
    return () => {
      loop.kill()
      st.kill()
    }
  })
})
</script>

<template>
  <section
    id="valor"
    ref="root"
    class="relative overflow-hidden bg-ink py-10 md:py-14"
    aria-label="Nuestros valores"
  >
    <div data-rule class="tick-rule mx-[var(--gutter)] origin-left text-paper" aria-hidden="true" />

    <!-- Versión accesible / movimiento reducido -->
    <ul class="sr-only">
      <li v-for="v in values" :key="v.a">{{ v.a }} {{ v.b }}</li>
    </ul>

    <div class="marquee my-8 md:my-10" aria-hidden="true">
      <div ref="track" class="marquee-track">
        <template v-for="n in 2" :key="n">
          <div v-for="v in values" :key="`${n}-${v.a}`" class="marquee-item">
            <span class="m-a">{{ v.a }}</span>
            <span class="m-b serif-accent">{{ v.b }}</span>
            <svg class="m-sep" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="4" fill="var(--color-accent)" />
              <g stroke="var(--color-accent)" stroke-width="1.4" stroke-linecap="round">
                <path
                  d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M4.6 19.4l2.1-2.1M17.3 6.7l2.1-2.1"
                />
              </g>
            </svg>
          </div>
        </template>
      </div>
    </div>

    <div
      data-rule
      class="tick-rule mx-[var(--gutter)] origin-right rotate-180 text-paper"
      aria-hidden="true"
    />
  </section>
</template>

<style scoped>
.marquee {
  display: flex;
  overflow: hidden;
  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
}
.marquee-track {
  display: flex;
  flex-shrink: 0;
  will-change: transform;
}
.marquee-item {
  display: flex;
  align-items: center;
  gap: 0.35em;
  padding-right: 0.6em;
  white-space: nowrap;
  font-size: clamp(2.4rem, 1.4rem + 4.2vw, 5.6rem);
  line-height: 1;
}
.m-a {
  font-family: var(--font-display);
  font-variation-settings: 'wdth' 112;
  font-weight: 500;
  letter-spacing: -0.035em;
  color: var(--color-paper);
}
.m-b {
  color: var(--color-mute);
  padding-right: 0.15em;
}
.m-sep {
  width: 0.55em;
  height: 0.55em;
  margin-left: 0.3em;
  flex-shrink: 0;
}
@media (prefers-reduced-motion: reduce) {
  .marquee {
    mask-image: none;
  }
  .marquee-track {
    flex-wrap: wrap;
    flex-shrink: 1;
    padding-inline: var(--gutter);
  }
  .marquee-item {
    font-size: clamp(1.8rem, 1.2rem + 2vw, 3rem);
    white-space: normal;
  }
  .marquee-track > :nth-child(n + 5) {
    display: none;
  }
}
</style>
