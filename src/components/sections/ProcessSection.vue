<script setup lang="ts">
import { ref } from 'vue'
import SectionLabel from '@/components/ui/SectionLabel.vue'
import MagneticButton from '@/components/ui/MagneticButton.vue'
import { gsap, MQ, revealLines, useGsap } from '@/composables/useMotion'

const steps = [
  {
    t: 'Diagnóstico de necesidades',
    d: 'Escuchamos tus objetivos y entendemos cómo y cuándo usas la energía.',
  },
  {
    t: 'Evaluación técnica',
    d: 'Analizamos el sitio, la información disponible y la viabilidad de cada alternativa.',
  },
  {
    t: 'Diseño de la solución',
    d: 'Definimos una propuesta técnica a la medida de las condiciones de tu proyecto.',
  },
  {
    t: 'Implementación del proyecto',
    d: 'Ejecutamos la instalación con planificación y control en cada etapa.',
  },
  {
    t: 'Seguimiento y soporte',
    d: 'Acompañamiento posterior cuando corresponde al servicio contratado.',
  },
]

const root = ref<HTMLElement | null>(null)

useGsap(root, (mm, el) => {
  const q = gsap.utils.selector(el)
  mm.add(MQ.motion, () => {
    const s = revealLines(q('[data-lines]')[0]!)
    // La línea de acento se llena con el avance del scroll
    gsap.fromTo(
      q('.p-fill')[0]!,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: q('.p-list')[0],
          start: 'top 65%',
          end: 'bottom 65%',
          scrub: 0.6,
        },
      },
    )
    q('.p-step').forEach((step) => {
      gsap.from(step.querySelectorAll('[data-p]'), {
        y: 40,
        autoAlpha: 0,
        stagger: 0.08,
        scrollTrigger: { trigger: step, start: 'top 82%', once: true },
      })
      gsap.to(step, {
        scrollTrigger: {
          trigger: step,
          start: 'top 65%',
          end: 'bottom 65%',
          toggleClass: { targets: step, className: 'is-lit' },
        },
      })
    })
    return () => s.revert()
  })
})
</script>

<template>
  <section
    id="proceso"
    ref="root"
    class="relative bg-paper py-[var(--section-y)] text-ink"
    aria-labelledby="proc-title"
  >
    <div class="container-x grid gap-16 lg:grid-cols-12 lg:gap-8">
      <div class="lg:col-span-5">
        <div class="lg:sticky lg:top-32">
          <SectionLabel index="05" label="Proceso de trabajo" tone="dark" />
          <h2 id="proc-title" data-lines class="display-lg mt-8 text-balance">
            Un método claro, de la idea a la
            <em class="serif-accent text-blue">energía.</em>
          </h2>
          <p class="lead mt-8 max-w-md text-mute-strong">
            Cada proyecto avanza por etapas definidas para que sepas en qué punto está y qué sigue.
          </p>
          <div class="mt-10">
            <MagneticButton href="#contacto" variant="outline-dark" icon="right"
              >Empezar el diagnóstico</MagneticButton
            >
          </div>
        </div>
      </div>

      <ol class="p-list relative lg:col-span-6 lg:col-start-7">
        <span
          class="absolute bottom-0 left-[1.6rem] top-0 w-px bg-ink/12 md:left-[2.1rem]"
          aria-hidden="true"
        >
          <span class="p-fill absolute inset-0 origin-top bg-accent" />
        </span>
        <li
          v-for="(s, i) in steps"
          :key="s.t"
          class="p-step relative grid grid-cols-[3.2rem_1fr] gap-5 pb-16 last:pb-0 md:grid-cols-[4.2rem_1fr] md:gap-8 md:pb-24"
        >
          <span data-p class="p-num" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
          <div class="pt-2">
            <p data-p class="mono text-mute-strong">Etapa {{ i + 1 }} de {{ steps.length }}</p>
            <h3 data-p class="display-md mt-3 !text-[clamp(1.5rem,1.1rem+1.4vw,2.4rem)]">
              {{ s.t }}
            </h3>
            <p data-p class="mt-3 max-w-md text-mute-strong">{{ s.d }}</p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.p-num {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 50%;
  background: var(--color-paper);
  border: 1px solid rgb(6 20 46 / 0.18);
  font-family: var(--font-display);
  font-variation-settings: 'wdth' 112;
  font-weight: 600;
  font-size: 0.95rem;
  transition:
    background 0.6s var(--ease-out-expo),
    border-color 0.6s,
    color 0.6s;
}
@media (min-width: 768px) {
  .p-num {
    width: 4.2rem;
    height: 4.2rem;
    font-size: 1.1rem;
  }
}
.p-step.is-lit .p-num {
  background: var(--color-blue);
  border-color: var(--color-blue);
  color: var(--color-accent);
}
@media (prefers-reduced-motion: reduce) {
  .p-fill {
    transform: scaleY(1);
  }
}
</style>
