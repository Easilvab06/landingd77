<script setup lang="ts">
/**
 * IMPACTO Y SOSTENIBILIDAD — conceptos cualitativos.
 * No se muestran cifras de generación, ahorro ni emisiones hasta contar
 * con datos reales validados.
 */
import { ref } from 'vue'
import { Sun, PanelsTopLeft, Cpu, Factory } from '@lucide/vue'
import SectionLabel from '@/components/ui/SectionLabel.vue'
import { gsap, MQ, revealLines, useGsap } from '@/composables/useMotion'

const flow = [
  { icon: Sun, title: 'Fuente renovable', text: 'La radiación solar disponible en el sitio.' },
  {
    icon: PanelsTopLeft,
    title: 'Generación',
    text: 'Los módulos fotovoltaicos convierten la luz en electricidad.',
  },
  {
    icon: Cpu,
    title: 'Conversión y control',
    text: 'Inversores y protecciones adaptan la energía para su uso.',
  },
  {
    icon: Factory,
    title: 'Tu operación',
    text: 'Energía integrada a los procesos que la necesitan.',
  },
]

const ideas = [
  {
    t: 'Aprovechamiento de fuentes renovables',
    d: 'Convertimos un recurso disponible en energía útil para tu operación.',
  },
  {
    t: 'Optimización del consumo energético',
    d: 'Analizamos cómo se usa la energía para diseñar con eficiencia.',
  },
  {
    t: 'Soluciones adaptadas a cada operación',
    d: 'Cada sistema responde a las condiciones reales del proyecto.',
  },
  {
    t: 'Una transición energética más sostenible',
    d: 'Contribuimos a que más sectores avancen hacia energías limpias.',
  },
]

const root = ref<HTMLElement | null>(null)

useGsap(root, (mm, el) => {
  const q = gsap.utils.selector(el)
  mm.add(MQ.motion, () => {
    const s = revealLines(q('[data-lines]')[0]!)

    const tl = gsap.timeline({
      scrollTrigger: { trigger: q('.flow')[0], start: 'top 78%', once: true },
    })
    q('.flow-node').forEach((node, i) => {
      tl.from(node, { y: 40, autoAlpha: 0, duration: 1 }, i * 0.32)
      const link = q('.flow-link')[i]
      if (link) tl.from(link, { scale: 0, duration: 0.9, ease: 'expo.inOut' }, i * 0.32 + 0.3)
    })

    gsap.to(q('.sun-ring')[0]!, {
      rotate: 120,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
    })

    q('.idea').forEach((row) => {
      gsap.from(row.querySelectorAll('[data-idea]'), {
        yPercent: 100,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 1.2,
        scrollTrigger: { trigger: row, start: 'top 88%', once: true },
      })
      gsap.from(row, {
        '--line': 0,
        duration: 1.6,
        ease: 'expo.inOut',
        scrollTrigger: { trigger: row, start: 'top 90%', once: true },
      })
    })
    return () => s.revert()
  })
})
</script>

<template>
  <section
    id="sostenibilidad"
    ref="root"
    class="relative overflow-hidden bg-ink py-[var(--section-y)] text-paper"
    aria-labelledby="imp-title"
  >
    <!-- Anillo solar decorativo -->
    <svg
      class="sun-ring pointer-events-none absolute -right-[20vw] -top-[10vw] w-[70vw] max-w-[60rem] opacity-[0.18]"
      viewBox="0 0 400 400"
      aria-hidden="true"
    >
      <circle cx="200" cy="200" r="199" fill="none" stroke="#5B9BFF" stroke-width=".6" />
      <circle
        cx="200"
        cy="200"
        r="150"
        fill="none"
        stroke="#8EA3C7"
        stroke-width=".5"
        stroke-dasharray="1 5"
      />
      <circle cx="200" cy="200" r="90" fill="none" stroke="#5B9BFF" stroke-width=".5" />
      <g stroke="#5B9BFF" stroke-width=".6">
        <line
          v-for="i in 48"
          :key="i"
          x1="200"
          y1="1"
          x2="200"
          :y2="i % 4 === 0 ? 22 : 10"
          :transform="`rotate(${i * 7.5} 200 200)`"
        />
      </g>
    </svg>

    <div class="container-x relative">
      <SectionLabel index="04" label="Impacto y sostenibilidad" />
      <div class="mt-8 grid gap-8 lg:grid-cols-12">
        <h2 id="imp-title" data-lines class="display-lg max-w-[14ch] text-balance lg:col-span-8">
          Energía que fluye con
          <em class="serif-accent text-accent">propósito.</em>
        </h2>
        <p class="lead self-end text-paper/70 lg:col-span-4">
          Así viaja la energía en una solución solar: desde el sol hasta los procesos que mueven tu
          operación.
        </p>
      </div>

      <!-- Diagrama de flujo -->
      <ol
        class="flow mt-20 grid gap-0 md:mt-28 lg:grid-cols-4"
        aria-label="Recorrido de la energía solar"
      >
        <li v-for="(f, i) in flow" :key="f.title" class="relative">
          <div class="flow-node relative z-10 flex gap-6 pb-12 lg:block lg:pb-0 lg:pr-10">
            <div class="node-dot" :class="{ 'is-sun': i === 0 }">
              <component :is="f.icon" :size="26" :stroke-width="1.4" />
            </div>
            <div class="lg:mt-8">
              <p class="mono text-mute">Etapa {{ i + 1 }}</p>
              <h3 class="mt-2 text-xl font-semibold tracking-tight">{{ f.title }}</h3>
              <p class="mt-2 max-w-xs text-[0.95rem] text-paper/65">{{ f.text }}</p>
            </div>
          </div>
          <span v-if="i < flow.length - 1" class="flow-link" aria-hidden="true"><span /></span>
        </li>
      </ol>

      <!-- Ideas -->
      <ul class="mt-24 md:mt-36">
        <li v-for="(idea, i) in ideas" :key="idea.t" class="idea group">
          <div class="grid items-baseline gap-3 py-8 md:grid-cols-12 md:gap-8 md:py-10">
            <span class="overflow-hidden md:col-span-1"
              ><span data-idea class="mono block text-accent">0{{ i + 1 }}</span></span
            >
            <span class="overflow-hidden md:col-span-7">
              <span data-idea class="idea-title block">{{ idea.t }}</span>
            </span>
            <span class="overflow-hidden md:col-span-4">
              <span data-idea class="block text-paper/65">{{ idea.d }}</span>
            </span>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.node-dot {
  position: relative;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 4.25rem;
  height: 4.25rem;
  border-radius: 50%;
  background: var(--color-blue);
  border: 1px solid rgb(255 255 255 / 0.15);
  color: var(--color-paper);
}
.node-dot.is-sun {
  background: var(--color-accent);
  color: var(--color-ink);
  box-shadow: 0 0 60px rgb(91 155 255 / 0.35);
}
/* Conectores animados: vertical en móvil, horizontal en desktop */
.flow-link {
  position: absolute;
  left: 2.125rem;
  top: 4.25rem;
  bottom: 0;
  width: 1px;
  overflow: hidden;
  background: rgb(255 255 255 / 0.14);
  transform-origin: top;
}
.flow-link span {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent, var(--color-accent), transparent);
  animation: current-v 2.6s linear infinite;
}
@media (min-width: 1024px) {
  .flow-link {
    left: 4.25rem;
    right: 0;
    top: 2.125rem;
    bottom: auto;
    width: auto;
    height: 1px;
    transform-origin: left;
  }
  .flow-link span {
    background: linear-gradient(to right, transparent, var(--color-accent), transparent);
    animation-name: current-h;
  }
}
@keyframes current-v {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(100%);
  }
}
@keyframes current-h {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(100%);
  }
}
.idea {
  --line: 1;
  position: relative;
}
.idea::before,
.idea:last-child::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background: rgb(255 255 255 / 0.15);
  transform: scaleX(var(--line));
  transform-origin: left;
}
.idea::before {
  top: 0;
}
.idea:last-child::after {
  bottom: 0;
}
.idea-title {
  font-family: var(--font-display);
  font-variation-settings: 'wdth' 108;
  font-weight: 500;
  font-size: clamp(1.5rem, 1rem + 2.2vw, 3rem);
  line-height: 1.05;
  letter-spacing: -0.03em;
  transition:
    color 0.5s,
    transform 0.8s var(--ease-out-expo);
}
@media (hover: hover) {
  .idea:hover .idea-title {
    color: var(--color-accent);
    transform: translateX(0.75rem);
  }
}
</style>
