<script setup lang="ts">
/**
 * NOSOTROS — Contenido editorial EDITABLE.
 * No incluye historia, años de experiencia ni misión oficial porque no se
 * han proporcionado. Reemplaza los textos cuando tengas la información validada.
 */
import { ref } from 'vue'
import ResponsiveImage from '@/components/ui/ResponsiveImage.vue'
import MagneticButton from '@/components/ui/MagneticButton.vue'
import SectionLabel from '@/components/ui/SectionLabel.vue'
import { images } from '@/data/images'
import { site } from '@/config/site'
import {
  fadeUp,
  MQ,
  parallax,
  revealImage,
  revealLines,
  useGsap,
  gsap,
} from '@/composables/useMotion'

const principles = [
  { k: 'Tecnología', v: 'Equipos y herramientas actuales al servicio de cada diseño.' },
  { k: 'Ingeniería', v: 'Criterio técnico en cada etapa, del diagnóstico a la ejecución.' },
  { k: 'Eficiencia', v: 'Soluciones orientadas a optimizar el consumo energético.' },
]

const root = ref<HTMLElement | null>(null)

useGsap(root, (mm, el) => {
  mm.add(MQ.motion, () => {
    const q = gsap.utils.selector(el)
    const splits = q('[data-lines]').map((t) => revealLines(t))
    revealImage(q('.about-frame')[0]!, q('.about-frame img')[0] ?? null, 'inset(0% 100% 0% 0%)')
    parallax(q('.about-parallax')[0]!, q('.about-frame')[0]!, 14)
    fadeUp(q('[data-fade]'), q('.about-copy')[0]!, { stagger: 0.1 })
    gsap.from(q('.principle'), {
      y: 40,
      autoAlpha: 0,
      stagger: 0.12,
      scrollTrigger: { trigger: q('.principles')[0], start: 'top 85%', once: true },
    })
    gsap.from(q('.draw-line'), {
      scaleY: 0,
      duration: 1.8,
      ease: 'expo.inOut',
      scrollTrigger: { trigger: el, start: 'top 70%', once: true },
    })
    return () => splits.forEach((s) => s.revert())
  })
})
</script>

<template>
  <section
    id="nosotros"
    ref="root"
    class="relative overflow-hidden bg-paper py-[var(--section-y)] text-ink"
    aria-labelledby="about-title"
  >
    <!-- Retícula de plano técnico -->
    <div class="blueprint pointer-events-none absolute inset-0" aria-hidden="true" />

    <div class="container-x relative">
      <SectionLabel index="01" label="Nosotros" tone="dark" />

      <h2 id="about-title" data-lines class="display-lg mt-8 max-w-[16ch] text-balance">
        Ingeniería que convierte energía en
        <em class="serif-accent text-blue">oportunidades.</em>
      </h2>

      <div class="mt-16 grid gap-12 md:mt-24 lg:grid-cols-12 lg:gap-8">
        <!-- Imagen -->
        <div class="relative lg:col-span-7">
          <div class="about-frame relative aspect-[4/5] overflow-hidden sm:aspect-[16/11]">
            <div class="about-parallax absolute -inset-y-[8%] inset-x-0">
              <ResponsiveImage
                :image="images.engineers"
                sizes="(min-width: 1024px) 58vw, 100vw"
                show-tag
                tag-position="br"
              />
            </div>
          </div>
          <div class="mt-4 flex items-center justify-between gap-4">
            <p class="mono text-mute-strong">Fig. 01 — Planificación técnica en campo</p>
          </div>
          <span
            class="draw-line absolute -left-4 top-0 hidden h-full w-px origin-top bg-ink/15 lg:block"
            aria-hidden="true"
          />
        </div>

        <!-- Texto -->
        <div class="about-copy flex flex-col justify-between gap-12 lg:col-span-4 lg:col-start-9">
          <div>
            <p data-fade class="lead text-ink/85">
              En {{ site.name }} impulsamos soluciones energéticas sostenibles mediante tecnología,
              ingeniería y una visión orientada a la eficiencia.
            </p>
            <p data-fade class="mt-6 text-mute-strong">
              Acompañamos a nuestros clientes en el desarrollo de proyectos que buscan optimizar el
              consumo energético y avanzar hacia una operación más sostenible.
            </p>
            <div data-fade class="mt-10">
              <MagneticButton href="#sostenibilidad" variant="outline-dark" icon="right">
                Conoce nuestra visión
              </MagneticButton>
            </div>
          </div>

          <ul class="principles border-t border-ink/15">
            <li
              v-for="(p, i) in principles"
              :key="p.k"
              class="principle grid grid-cols-[3rem_1fr] gap-x-2 border-b border-ink/15 py-5"
            >
              <span class="mono pt-1.5 text-blue">0{{ i + 1 }}</span>
              <div>
                <p class="display-md !text-[1.4rem]">{{ p.k }}</p>
                <p class="mt-1 text-[0.95rem] text-mute-strong">{{ p.v }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.blueprint {
  background-image:
    linear-gradient(rgb(15 58 138 / 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgb(15 58 138 / 0.045) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(80% 60% at 80% 20%, #000, transparent 75%);
}
</style>
