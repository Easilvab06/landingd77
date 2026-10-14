<script setup lang="ts">
/**
 * PROYECTOS — Portafolio editorial.
 * Desktop + movimiento: galería horizontal fijada que avanza con el scroll.
 * Móvil / movimiento reducido: composición vertical tipo revista.
 * Escala automáticamente: añade proyectos en src/data/projects.ts.
 */
import { ref } from 'vue'
import { ArrowUpRight } from '@lucide/vue'
import ResponsiveImage from '@/components/ui/ResponsiveImage.vue'
import SectionLabel from '@/components/ui/SectionLabel.vue'
import ProjectModal from './ProjectModal.vue'
import { projects } from '@/data/projects'
import type { Project } from '@/types'
import { gsap, MQ, revealLines, useGsap } from '@/composables/useMotion'

const root = ref<HTMLElement | null>(null)
const track = ref<HTMLElement | null>(null)
const progress = ref<HTMLElement | null>(null)
const counter = ref(1)
const current = ref<Project | null>(null)
const opener = ref<HTMLElement | null>(null)

function openProject(p: Project, e: Event) {
  opener.value = e.currentTarget as HTMLElement
  current.value = p
}
function closeProject() {
  current.value = null
  opener.value?.focus()
}

const pad = (n: number) => String(n).padStart(2, '0')

useGsap(root, (mm, el) => {
  const q = gsap.utils.selector(el)

  mm.add(MQ.motion, () => {
    const s = revealLines(q('[data-lines]')[0]!)
    return () => s.revert()
  })

  // Galería horizontal fijada
  mm.add(`${MQ.motion} and ${MQ.desktop}`, () => {
    const t = track.value!
    const distance = () => t.scrollWidth - window.innerWidth
    const tween = gsap.to(t, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: q('.pj-pin')[0],
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate(self) {
          if (progress.value) progress.value.style.transform = `scaleX(${self.progress})`
          counter.value = Math.min(
            projects.length,
            Math.max(1, Math.round(self.progress * (projects.length - 1)) + 1),
          )
        },
      },
    })
    // Cada imagen: revelado con máscara y parallax interno ligado al avance horizontal
    q('.pj-card').forEach((card) => {
      const img = card.querySelector('.pj-img')
      gsap.fromTo(
        img,
        { xPercent: -10, scale: 1.15 },
        {
          xPercent: 10,
          scale: 1.15,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            containerAnimation: tween,
            start: 'left right',
            end: 'right left',
            scrub: true,
          },
        },
      )
      gsap.from(card.querySelectorAll('[data-meta]'), {
        y: 30,
        autoAlpha: 0,
        stagger: 0.06,
        scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 85%', once: true },
      })
    })
  })

  // Vertical (móvil o sin pin)
  mm.add(`${MQ.motion} and ${MQ.mobile}`, () => {
    q('.pj-card').forEach((card) => {
      const frame = card.querySelector('.pj-frame')
      gsap.fromTo(
        frame,
        { clipPath: 'inset(12% 8% 12% 8%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: 'none',
          scrollTrigger: { trigger: card, start: 'top 95%', end: 'top 45%', scrub: true },
        },
      )
    })
  })
})
</script>

<template>
  <section id="proyectos" ref="root" class="relative bg-ink text-paper" aria-labelledby="pj-title">
    <div class="pj-pin relative overflow-hidden lg:h-[100svh]">
      <div
        ref="track"
        class="pj-track flex flex-col gap-20 py-[var(--section-y)] lg:h-full lg:flex-row lg:items-center lg:gap-[4vw] lg:py-0 lg:pl-[var(--gutter)] lg:pr-[8vw]"
      >
        <!-- Introducción -->
        <header class="container-x shrink-0 lg:w-[34vw] lg:max-w-none lg:px-0">
          <SectionLabel index="03" label="Proyectos destacados" />
          <h2 id="pj-title" data-lines class="display-lg mt-8 text-balance">
            Energía que se ve a
            <em class="serif-accent text-accent">gran escala.</em>
          </h2>
          <p class="mt-8 max-w-md text-paper/70">
            Un portafolio visual de instalaciones y obras. Selecciona un proyecto para ver su ficha
            y su galería fotográfica.
          </p>
          <p class="mono mt-10 hidden items-center gap-3 text-mute lg:flex">
            <span class="h-px w-10 bg-current" aria-hidden="true" />Desplázate para recorrer
          </p>
        </header>

        <!-- Tarjetas -->
        <article
          v-for="(p, i) in projects"
          :key="p.id"
          class="pj-card container-x shrink-0 lg:max-w-none lg:px-0"
          :class="`pj-card--${p.layout}`"
          :aria-labelledby="`pj-${p.id}`"
        >
          <button
            type="button"
            class="pj-hit group block w-full text-left"
            :aria-label="`Ver proyecto: ${p.name}`"
            @click="openProject(p, $event)"
          >
            <div class="pj-frame relative overflow-hidden">
              <div class="pj-img absolute inset-0">
                <ResponsiveImage
                  :image="p.cover"
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  show-tag
                  tag-position="tl"
                />
              </div>
              <div class="pj-hover" aria-hidden="true">
                <span class="pj-view">Ver proyecto <ArrowUpRight :size="18" /></span>
              </div>
            </div>
          </button>
          <div class="mt-5 flex items-start justify-between gap-6">
            <div>
              <p data-meta class="mono text-accent">P/{{ pad(i + 1) }}</p>
              <h3
                :id="`pj-${p.id}`"
                data-meta
                class="display-md mt-2 !text-[clamp(1.4rem,1rem+1.2vw,2.1rem)]"
              >
                {{ p.name }}
              </h3>
              <p
                v-if="p.installationType || p.location"
                data-meta
                class="mt-2 text-sm text-paper/60"
              >
                {{ [p.installationType, p.location, p.power].filter(Boolean).join(' · ') }}
              </p>
            </div>
            <button
              type="button"
              data-meta
              class="pj-cta shrink-0"
              :aria-label="`Ver proyecto: ${p.name}`"
              @click="openProject(p, $event)"
            >
              <ArrowUpRight :size="20" :stroke-width="1.5" />
            </button>
          </div>
        </article>
      </div>

      <!-- Progreso (desktop) -->
      <div
        class="pointer-events-none absolute inset-x-[var(--gutter)] bottom-8 hidden items-center gap-6 lg:flex"
        aria-hidden="true"
      >
        <span class="mono tabular-nums text-paper/80">{{ pad(counter) }}</span>
        <span class="relative h-px flex-1 bg-white/15">
          <span
            ref="progress"
            class="absolute inset-0 origin-left bg-accent"
            style="transform: scaleX(0)"
          />
        </span>
        <span class="mono tabular-nums text-mute">{{ pad(projects.length) }}</span>
      </div>
    </div>

    <ProjectModal :project="current" @close="closeProject" />
  </section>
</template>

<style scoped>
/* Sin animaciones en desktop: la galería se recorre con scroll horizontal nativo */
@media (min-width: 1024px) and (prefers-reduced-motion: reduce) {
  .pj-pin {
    overflow-x: auto;
  }
}
.pj-frame {
  aspect-ratio: 4 / 3;
  background: var(--color-blue-deep);
}
.pj-card--tall .pj-frame {
  aspect-ratio: 4 / 5;
}
@media (min-width: 1024px) {
  .pj-card--wide {
    width: 56vw;
  }
  .pj-card--wide .pj-frame {
    aspect-ratio: auto;
    height: 58svh;
  }
  .pj-card--tall {
    width: 30vw;
  }
  .pj-card--tall .pj-frame {
    aspect-ratio: auto;
    height: 58svh;
  }
  .pj-card--square {
    width: 40vw;
  }
  .pj-card--square .pj-frame {
    aspect-ratio: auto;
    height: 50svh;
  }
  .pj-card:nth-child(odd) {
    align-self: flex-end;
    margin-bottom: 9svh;
  }
  .pj-card:nth-child(even) {
    align-self: flex-start;
    margin-top: 6svh;
  }
}
.pj-img {
  will-change: transform;
}
.pj-img :deep(img) {
  transition: transform 1.4s var(--ease-out-expo);
}
.pj-hit:hover .pj-img :deep(img),
.pj-hit:focus-visible .pj-img :deep(img) {
  transform: scale(1.06);
}
.pj-hover {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgb(6 20 46 / 0.35);
  opacity: 0;
  transition: opacity 0.6s var(--ease-out-expo);
}
.pj-view {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.4rem;
  border-radius: 999px;
  background: var(--color-accent);
  color: var(--color-ink);
  font-weight: 600;
  transform: translateY(1rem) scale(0.9);
  transition: transform 0.7s var(--ease-out-expo);
}
.pj-hit:hover .pj-hover,
.pj-hit:focus-visible .pj-hover {
  opacity: 1;
}
.pj-hit:hover .pj-view,
.pj-hit:focus-visible .pj-view {
  transform: none;
}
.pj-cta {
  display: grid;
  place-items: center;
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 999px;
  border: 1px solid rgb(255 255 255 / 0.25);
  color: var(--color-paper);
  transition:
    background 0.4s,
    color 0.4s,
    border-color 0.4s,
    transform 0.6s var(--ease-out-expo);
}
.pj-cta:hover {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: var(--color-ink);
  transform: rotate(45deg);
}
</style>
