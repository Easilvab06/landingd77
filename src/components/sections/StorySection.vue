<script setup lang="ts">
/**
 * STORYTELLING — "El recorrido de la energía".
 * Sección fijada (pin) que avanza con el scroll en 4 capítulos:
 * el sol sale, los paneles captan la luz, la energía se convierte y
 * finalmente ilumina la operación. La escena SVG está dibujada en su
 * estado final: con movimiento reducido se ve completa y sin pin.
 */
import { ref } from 'vue'
import { gsap, MQ, useGsap } from '@/composables/useMotion'

const chapters = [
  {
    t: 'El sol',
    d: 'Todo empieza con un recurso que llega cada día: la radiación solar disponible en el lugar del proyecto.',
  },
  {
    t: 'Captación',
    d: 'Los módulos fotovoltaicos convierten esa luz en electricidad en corriente continua.',
  },
  {
    t: 'Conversión',
    d: 'Inversores y protecciones transforman y controlan la energía para usarla con seguridad.',
  },
  {
    t: 'Tu operación',
    d: 'La energía llega a los procesos que la necesitan: bombeo, riego, producción y espacios de trabajo.',
  },
]

// Geometría de la escena
const HORIZON = 420
const CX = 320
const R = 250
const sunAt = (deg: number) => {
  const a = (deg * Math.PI) / 180
  return { x: CX + R * Math.cos(a), y: HORIZON - R * Math.sin(a) }
}
const SUN_FINAL = sunAt(70)
const BEAM_FROM = sunAt(70)
const panels = Array.from({ length: 5 }, (_, i) => {
  const x = 34 + i * 64
  return {
    x,
    points: `${x},476 ${x + 54},476 ${x + 72},432 ${x + 18},432`,
    grid: `M${x + 9} 454 H${x + 63} M${x + 27} 476 L${x + 45} 432`,
    cx: x + 36,
    cy: 454,
  }
})
const windows = Array.from({ length: 15 }, (_, i) => ({
  x: 516 + (i % 3) * 30,
  y: 270 + Math.floor(i / 3) * 38,
}))
const WIRE_1 = 'M392 456 C 404 456 410 446 418 446'
const WIRE_2 = 'M474 446 C 488 446 494 452 504 452'
const WIRE_PATH = 'M392 456 C 404 456 410 446 418 446 L474 446 C 488 446 494 452 504 452'

const root = ref<HTMLElement | null>(null)
const current = ref(0)
const bar = ref<HTMLElement | null>(null)

useGsap(root, (mm, el) => {
  mm.add(MQ.motion, () => {
    const q = gsap.utils.selector(el)
    const sun = q('.sc-sun')[0]!
    const proxy = { a: 192 }
    const beams = q('.sc-beam')
    const placeSun = () => {
      const p = sunAt(proxy.a)
      sun.setAttribute('transform', `translate(${p.x} ${p.y})`)
      // Los haces de luz siempre nacen del sol
      beams.forEach((b) => {
        b.setAttribute('x1', String(p.x))
        b.setAttribute('y1', String(p.y + 26))
      })
    }

    // Longitud de los trazos para "dibujarlos"
    const draw = q('[data-draw]') as unknown as SVGGeometryElement[]
    draw.forEach((p) => {
      const len = p.getTotalLength()
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
    })

    const texts = q('.st-chapter')
    gsap.set(texts.slice(1), { autoAlpha: 0, yPercent: 40 })
    gsap.set(q('.sc-panel'), { fill: '#0b2c6b' })
    gsap.set(q('.sc-window'), { fill: '#0b2c6b' })
    gsap.set(q('.sc-beam, .sc-pulses, .sc-glow, .sc-sky'), { autoAlpha: 0 })
    gsap.set(q('.sc-inverter'), { opacity: 0.35 })
    placeSun()

    const swap = (from: number, to: number, at: number, tl: gsap.core.Timeline) => {
      tl.to(texts[from]!, { autoAlpha: 0, yPercent: -40, duration: 0.25, ease: 'power2.in' }, at)
      tl.fromTo(
        texts[to]!,
        { autoAlpha: 0, yPercent: 40 },
        { autoAlpha: 1, yPercent: 0, duration: 0.3, ease: 'power2.out' },
        at + 0.22,
      )
    }

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: q('.st-pin')[0],
        start: 'top top',
        end: '+=320%',
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        onUpdate(self) {
          current.value = Math.min(3, Math.floor(self.progress * 4 * 0.999))
          if (bar.value) bar.value.style.transform = `scaleY(${self.progress})`
        },
      },
    })

    // 01 — El sol sale
    tl.to(proxy, { a: 128, duration: 1, onUpdate: placeSun }, 0)
      .to(q('.sc-sky'), { autoAlpha: 1, duration: 0.8 }, 0)
      .fromTo(
        q('.sc-rays'),
        { rotate: -40, scale: 0.6, svgOrigin: '0 0' },
        { rotate: 0, scale: 1, duration: 1 },
        0,
      )

    // 02 — Captación
    swap(0, 1, 1, tl)
    tl.to(proxy, { a: 108, duration: 1, onUpdate: placeSun }, 1)
      .to(q('.sc-beam'), { autoAlpha: 1, stagger: 0.08, duration: 0.3 }, 1.1)
      .to(q('.sc-panel'), { fill: '#5b9bff', stagger: 0.1, duration: 0.4 }, 1.3)

    // 03 — Conversión
    swap(1, 2, 2, tl)
    tl.to(proxy, { a: 90, duration: 1, onUpdate: placeSun }, 2)
      .to(q('.sc-beam'), { autoAlpha: 0.35, duration: 0.3 }, 2)
      .to(q('.sc-wire-1'), { strokeDashoffset: 0, duration: 0.35 }, 2.1)
      .to(q('.sc-inverter'), { opacity: 1, duration: 0.2 }, 2.35)
      .to(q('.sc-wave'), { strokeDashoffset: 0, duration: 0.35 }, 2.4)
      .to(q('.sc-wire-2'), { strokeDashoffset: 0, duration: 0.35 }, 2.65)
      .to(q('.sc-pulses'), { autoAlpha: 1, duration: 0.2 }, 2.8)

    // 04 — Tu operación
    swap(2, 3, 3, tl)
    tl.to(proxy, { a: 70, duration: 1, onUpdate: placeSun }, 3)
      .to(q('.sc-building'), { strokeDashoffset: 0, duration: 0.4 }, 3)
      .to(
        q('.sc-window'),
        { fill: '#b9d3ff', stagger: { each: 0.035, from: 'random' }, duration: 0.2 },
        3.2,
      )
      .to(q('.sc-glow'), { autoAlpha: 1, duration: 0.5 }, 3.4)

    // Pulsos de energía que viajan por el cable (bucle independiente)
    const wirePath = q('.sc-wire-path')[0] as unknown as SVGPathElement
    const pulses = q('.sc-pulse').map((p, i) =>
      gsap.to(p, {
        motionPath: { path: wirePath, align: wirePath, alignOrigin: [0.5, 0.5] },
        duration: 1.6,
        delay: i * 0.53,
        repeat: -1,
        ease: 'none',
      }),
    )
    return () => pulses.forEach((t) => t.kill())
  })
})
</script>

<template>
  <section id="recorrido" ref="root" class="relative bg-ink text-paper" aria-labelledby="st-title">
    <div class="st-pin relative overflow-hidden">
      <div class="st-bg pointer-events-none absolute inset-0" aria-hidden="true" />

      <div class="container-x st-grid relative">
        <!-- Texto -->
        <div class="st-copy">
          <p class="mono flex items-center gap-4 text-mute">
            <span class="text-accent">Recorrido</span>
            <span class="h-px w-10 bg-current opacity-40" aria-hidden="true" />
            Del sol a tu operación
          </p>
          <h2 id="st-title" class="display-md mt-6 max-w-[16ch]">
            Así viaja la <em class="serif-accent text-accent">energía</em> que diseñamos.
          </h2>

          <div class="mt-10 flex items-start gap-6 md:mt-14">
            <div class="st-count" aria-hidden="true">
              <span class="tabular-nums">0{{ current + 1 }}</span>
              <span class="st-track"><span ref="bar" class="st-bar" /></span>
              <span class="text-mute tabular-nums">04</span>
            </div>
            <ol class="st-chapters">
              <li v-for="(c, i) in chapters" :key="c.t" class="st-chapter">
                <p class="mono text-accent">Capítulo {{ i + 1 }}</p>
                <h3 class="st-chapter-title">{{ c.t }}</h3>
                <p class="mt-3 max-w-md text-paper/70">{{ c.d }}</p>
              </li>
            </ol>
          </div>
        </div>

        <!-- Escena -->
        <div class="st-scene" aria-hidden="true">
          <svg viewBox="0 0 640 520" class="h-full w-full" preserveAspectRatio="xMidYMid meet">
            <defs>
              <radialGradient id="st-sun" cx="50%" cy="50%" r="50%">
                <stop offset="0" stop-color="#ffffff" />
                <stop offset=".45" stop-color="#b9d3ff" />
                <stop offset="1" stop-color="#5b9bff" stop-opacity="0" />
              </radialGradient>
              <linearGradient id="st-skyg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#5b9bff" stop-opacity="0" />
                <stop offset="1" stop-color="#5b9bff" stop-opacity=".22" />
              </linearGradient>
              <radialGradient id="st-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0" stop-color="#b9d3ff" stop-opacity=".55" />
                <stop offset="1" stop-color="#5b9bff" stop-opacity="0" />
              </radialGradient>
              <clipPath id="st-skyclip">
                <rect x="0" y="0" width="640" :height="HORIZON" />
              </clipPath>
            </defs>

            <rect class="sc-sky" x="0" y="0" width="640" :height="HORIZON" fill="url(#st-skyg)" />

            <!-- Arco solar y retícula -->
            <path
              :d="`M ${CX - R} ${HORIZON} A ${R} ${R} 0 0 1 ${CX + R} ${HORIZON}`"
              fill="none"
              stroke="rgba(255,255,255,.14)"
              stroke-dasharray="2 6"
            />
            <g stroke="rgba(255,255,255,.08)">
              <line v-for="i in 9" :key="i" :x1="i * 64" :x2="i * 64" y1="40" :y2="HORIZON" />
            </g>

            <!-- Sol -->
            <g clip-path="url(#st-skyclip)">
              <g class="sc-sun" :transform="`translate(${SUN_FINAL.x} ${SUN_FINAL.y})`">
                <circle r="70" fill="url(#st-sun)" opacity=".55" />
                <g class="sc-rays" stroke="#b9d3ff" stroke-width="2" stroke-linecap="round">
                  <line
                    v-for="i in 12"
                    :key="i"
                    x1="0"
                    y1="-34"
                    x2="0"
                    y2="-46"
                    :transform="`rotate(${i * 30})`"
                  />
                </g>
                <circle r="24" fill="#ffffff" />
              </g>
            </g>

            <line x1="0" :x2="640" :y1="HORIZON" :y2="HORIZON" stroke="rgba(255,255,255,.3)" />
            <line x1="0" x2="640" y1="476" y2="476" stroke="rgba(255,255,255,.18)" />

            <!-- Haces de luz hacia los paneles -->
            <g stroke="#5b9bff" stroke-width="1.2" stroke-dasharray="3 5">
              <line
                v-for="p in panels"
                :key="`b${p.x}`"
                class="sc-beam"
                :x1="BEAM_FROM.x"
                :y1="BEAM_FROM.y"
                :x2="p.cx"
                :y2="p.cy - 22"
              />
            </g>

            <!-- Paneles -->
            <g v-for="p in panels" :key="p.x">
              <polygon
                class="sc-panel"
                :points="p.points"
                fill="#5b9bff"
                stroke="#fff"
                stroke-width="1.2"
              />
              <path :d="p.grid" stroke="rgba(255,255,255,.55)" stroke-width=".8" fill="none" />
              <line :x1="p.cx" :x2="p.cx" y1="476" y2="488" stroke="rgba(255,255,255,.5)" />
            </g>

            <!-- Cableado e inversor -->
            <path
              class="sc-wire-1"
              data-draw
              :d="WIRE_1"
              fill="none"
              stroke="#5b9bff"
              stroke-width="2.4"
            />
            <g class="sc-inverter">
              <rect
                x="418"
                y="418"
                width="56"
                height="58"
                rx="8"
                fill="#0b2c6b"
                stroke="#fff"
                stroke-width="1.4"
              />
              <path
                class="sc-wave"
                data-draw
                d="M428 447 q 6 -12 12 0 t 12 0 t 12 0"
                fill="none"
                stroke="#b9d3ff"
                stroke-width="2"
                stroke-linecap="round"
              />
              <circle cx="466" cy="428" r="2.5" fill="#5b9bff" />
            </g>
            <path
              class="sc-wire-2"
              data-draw
              :d="WIRE_2"
              fill="none"
              stroke="#5b9bff"
              stroke-width="2.4"
            />
            <path class="sc-wire-path" :d="WIRE_PATH" fill="none" stroke="none" />
            <g class="sc-pulses">
              <circle v-for="i in 3" :key="i" class="sc-pulse" r="4" fill="#ffffff" />
            </g>

            <!-- Edificio / operación -->
            <ellipse class="sc-glow" cx="560" cy="360" rx="120" ry="140" fill="url(#st-glow)" />
            <path
              class="sc-building"
              data-draw
              d="M504 476 V256 L560 230 L616 256 V476"
              fill="none"
              stroke="#fff"
              stroke-width="1.6"
              stroke-linejoin="round"
            />
            <rect
              v-for="(w, i) in windows"
              :key="i"
              class="sc-window"
              :x="w.x"
              :y="w.y"
              width="18"
              height="22"
              rx="2"
              fill="#b9d3ff"
            />
          </svg>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.st-bg {
  background:
    radial-gradient(50% 50% at 75% 45%, rgb(15 58 138 / 0.6), transparent 70%),
    linear-gradient(to bottom, var(--color-ink), #081a3c);
}
.st-grid {
  display: grid;
  gap: 2.5rem;
  padding-block: 7rem 4rem;
}
.st-scene {
  width: 100%;
  max-width: 44rem;
  margin-inline: auto;
}
.st-count {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.7rem;
  font-family: var(--font-display);
  font-variation-settings: 'wdth' 112;
  font-weight: 600;
  font-size: 1rem;
}
.st-track {
  position: relative;
  width: 1px;
  height: 7rem;
  background: rgb(255 255 255 / 0.15);
}
.st-bar {
  position: absolute;
  inset: 0;
  background: var(--color-accent);
  transform-origin: top;
  transform: scaleY(1);
}
.st-chapters {
  display: grid;
  gap: 2.5rem;
  flex: 1;
}
.st-chapter-title {
  margin-top: 0.4rem;
  font-family: var(--font-display);
  font-variation-settings: 'wdth' 110;
  font-weight: 500;
  font-size: clamp(2rem, 1.4rem + 2.4vw, 3.6rem);
  line-height: 1;
  letter-spacing: -0.03em;
}

/* Con movimiento: escena fijada a pantalla completa y capítulos superpuestos */
@media (prefers-reduced-motion: no-preference) {
  .st-pin {
    height: 100svh;
  }
  .st-grid {
    height: 100%;
    grid-template-rows: auto 1fr;
    align-content: center;
    padding-block: 5.5rem 1.5rem;
    gap: 1rem;
  }
  .st-scene {
    height: 100%;
    min-height: 0;
    order: -1;
  }
  .st-chapters {
    position: relative;
    display: block;
    min-height: 9.5rem;
  }
  .st-chapter {
    position: absolute;
    inset: 0 0 auto 0;
  }
  .st-chapter:first-child {
    position: relative;
  }
  .st-copy h2,
  .st-copy > p {
    display: none;
  }
  .st-bar {
    transform: scaleY(0);
  }
  @media (min-width: 1024px) {
    .st-grid {
      grid-template-columns: 5fr 7fr;
      grid-template-rows: 1fr;
      align-items: center;
      gap: 3rem;
      padding-block: 6rem 3rem;
    }
    .st-scene {
      order: 0;
      height: min(72svh, 40rem);
    }
    .st-copy h2,
    .st-copy > p {
      display: block;
    }
    .st-copy > p {
      display: flex;
    }
  }
}
@media (min-width: 1024px) {
  .st-grid {
    grid-template-columns: 5fr 7fr;
    align-items: center;
  }
}
@media (prefers-reduced-motion: reduce) {
  .sc-pulses,
  .st-count {
    display: none;
  }
}
</style>
