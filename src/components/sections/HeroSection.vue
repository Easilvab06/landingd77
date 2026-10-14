<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import ResponsiveImage from '@/components/ui/ResponsiveImage.vue'
import MagneticButton from '@/components/ui/MagneticButton.vue'
import EnergyCanvas from '@/components/hero/EnergyCanvas.vue'
import SunTracker from '@/components/hero/SunTracker.vue'
import { images } from '@/data/images'
import { site } from '@/config/site'
import { gsap, MQ, SplitText } from '@/composables/useMotion'

const props = defineProps<{ ready: boolean }>()

const root = ref<HTMLElement | null>(null)
const media = ref<HTMLElement | null>(null)
const title = ref<HTMLElement | null>(null)
const spot = ref<HTMLElement | null>(null)

let mm: gsap.MatchMedia | undefined
let intro: gsap.core.Timeline | undefined
let split: SplitText | undefined

onMounted(() => {
  if (!root.value) return
  mm = gsap.matchMedia(root.value)
  mm.add(MQ.motion, () => {
    const q = gsap.utils.selector(root.value)
    split = SplitText.create(title.value!, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
    })

    intro = gsap
      .timeline({ paused: true, defaults: { ease: 'expo.out' } })
      .fromTo(
        media.value,
        { clipPath: 'inset(18% 12% 18% 12%)', scale: 1.08 },
        { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.8, ease: 'expo.inOut' },
      )
      .from(q('.hero-img'), { scale: 1.35, duration: 2.4 }, 0)
      .from(
        split.lines,
        { yPercent: 115, rotate: 3, transformOrigin: '0 100%', duration: 1.5, stagger: 0.1 },
        0.75,
      )
      .from(q('[data-hero-fade]'), { y: 30, autoAlpha: 0, duration: 1.3, stagger: 0.08 }, 1.05)
      .from(q('.hero-rule'), { scaleX: 0, duration: 1.6, ease: 'expo.inOut' }, 0.9)

    // Scroll: la imagen se hunde y se acerca, el texto se eleva y se disuelve
    gsap
      .timeline({
        scrollTrigger: { trigger: root.value, start: 'top top', end: 'bottom top', scrub: true },
      })
      .to(q('.hero-parallax'), { yPercent: 22, scale: 1.12, ease: 'none' }, 0)
      .to(q('.hero-content'), { yPercent: -18, autoAlpha: 0.15, ease: 'none' }, 0)
      .to(q('.hero-shade'), { opacity: 1, ease: 'none' }, 0)

    if (props.ready) intro.play()

    return () => split?.revert()
  })

  // Foco de luz que sigue al puntero (solo punteros finos)
  mm.add(`${MQ.motion} and ${MQ.finePointer}`, () => {
    const xTo = gsap.quickTo(spot.value, 'x', { duration: 1.2, ease: 'power3.out' })
    const yTo = gsap.quickTo(spot.value, 'y', { duration: 1.2, ease: 'power3.out' })
    const move = (e: PointerEvent) => {
      const r = root.value!.getBoundingClientRect()
      xTo(e.clientX - r.left)
      yTo(e.clientY - r.top)
    }
    root.value!.addEventListener('pointermove', move)
    return () => root.value?.removeEventListener('pointermove', move)
  })
})

watch(
  () => props.ready,
  (r) => r && intro?.play(),
)

onBeforeUnmount(() => mm?.revert())
</script>

<template>
  <section
    id="inicio"
    ref="root"
    class="hero relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink"
    aria-labelledby="hero-title"
  >
    <!-- Fotografía -->
    <div ref="media" class="absolute inset-0 -z-10 overflow-hidden">
      <div class="hero-parallax absolute inset-0 will-change-transform">
        <ResponsiveImage
          :image="images.sunsetAerial"
          priority
          sizes="100vw"
          img-class="hero-img"
          alt="Parque solar visto desde el aire al atardecer"
        />
      </div>
      <!-- Tratamiento cromático: azul corporativo en sombras, oro en las luces -->
      <div class="hero-grade absolute inset-0" />
      <div class="hero-shade absolute inset-0 bg-ink opacity-0" />
      <EnergyCanvas />
      <div ref="spot" class="hero-spot" aria-hidden="true" />
      <div class="grain absolute inset-0" />
    </div>

    <!-- Retícula técnica -->
    <div class="pointer-events-none absolute inset-0 -z-[5] hidden lg:block" aria-hidden="true">
      <div class="container-x relative h-full">
        <span class="absolute inset-y-0 left-[var(--gutter)] w-px bg-white/[0.07]" />
        <span class="absolute inset-y-0 left-1/2 w-px bg-white/[0.05]" />
        <span class="absolute inset-y-0 right-[var(--gutter)] w-px bg-white/[0.07]" />
      </div>
    </div>

    <div
      class="hero-content container-x relative flex flex-1 flex-col justify-end pb-10 pt-32 md:pb-14"
    >
      <div class="mb-8 flex items-center gap-4 md:mb-10" data-hero-fade>
        <span class="mono text-accent">{{ site.name }}</span>
        <span class="h-px w-12 bg-accent/60" aria-hidden="true" />
        <span class="mono text-paper/75">Ingeniería en energías renovables · Colombia</span>
      </div>

      <h1 id="hero-title" ref="title" class="display-xl max-w-[14ch] text-paper text-balance">
        La energía del futuro comienza con
        <em class="serif-accent text-accent-soft">decisiones inteligentes.</em>
      </h1>

      <div
        class="hero-rule mt-10 h-px w-full origin-left bg-white/20 md:mt-14"
        aria-hidden="true"
      />

      <div class="mt-8 grid items-end gap-10 lg:grid-cols-12 lg:gap-8">
        <div class="lg:col-span-6 xl:col-span-5">
          <p class="lead max-w-xl text-paper/85" data-hero-fade>
            Diseñamos e implementamos soluciones de energía renovable que transforman la manera en
            que empresas, industrias y sectores productivos generan y utilizan energía.
          </p>
          <div class="mt-8 flex flex-wrap gap-3" data-hero-fade>
            <MagneticButton href="#soluciones" size="lg" icon="down"
              >Descubrir nuestras soluciones</MagneticButton
            >
            <MagneticButton href="#proyectos" size="lg" variant="outline" icon="right">
              Explorar proyectos
            </MagneticButton>
          </div>
        </div>

        <div
          class="flex items-end justify-between gap-6 lg:col-span-6 xl:col-span-7 lg:justify-end"
        >
          <a
            href="#valor"
            class="scroll-cue hidden md:flex"
            data-hero-fade
            aria-label="Desplazarse al contenido"
          >
            <span class="mono text-paper/70">Desplázate</span>
            <span class="scroll-line" aria-hidden="true"><span /></span>
          </a>
          <div class="w-full sm:w-auto" data-hero-fade>
            <SunTracker />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-grade {
  background:
    linear-gradient(
      to top,
      rgb(6 20 46 / 0.96) 0%,
      rgb(6 20 46 / 0.62) 32%,
      rgb(6 20 46 / 0.12) 62%,
      rgb(6 20 46 / 0.5) 100%
    ),
    linear-gradient(100deg, rgb(15 58 138 / 0.72) 0%, rgb(15 58 138 / 0.05) 60%),
    radial-gradient(60% 50% at 92% 55%, rgb(91 155 255 / 0.18), transparent 70%);
}
.hero-spot {
  position: absolute;
  top: 0;
  left: 0;
  width: 46rem;
  height: 46rem;
  margin: -23rem 0 0 -23rem;
  border-radius: 50%;
  background: radial-gradient(circle, rgb(91 155 255 / 0.16), rgb(91 155 255 / 0) 60%);
  mix-blend-mode: screen;
  pointer-events: none;
  transform: translate(-100vw, -100vh);
}
.scroll-cue {
  flex-direction: column;
  align-items: center;
  gap: 0.9rem;
  margin-right: auto;
}
.scroll-line {
  position: relative;
  display: block;
  width: 1px;
  height: 4.5rem;
  overflow: hidden;
  background: rgb(255 255 255 / 0.2);
}
.scroll-line span {
  position: absolute;
  inset: 0;
  background: var(--color-accent);
  animation: drop 2.4s var(--ease-in-out-quart) infinite;
}
@keyframes drop {
  0% {
    transform: translateY(-100%);
  }
  60%,
  100% {
    transform: translateY(100%);
  }
}
</style>
