<script setup lang="ts">
import { computed, ref } from 'vue'
import { Sun, Droplets, Sprout, PlugZap, Activity, Compass, Plus, ArrowUpRight } from '@lucide/vue'
import ResponsiveImage from '@/components/ui/ResponsiveImage.vue'
import SectionLabel from '@/components/ui/SectionLabel.vue'
import { solutions } from '@/data/solutions'
import { selectedSolution } from '@/composables/useInquiry'
import { scrollToId } from '@/composables/useSmoothScroll'
import { gsap, MQ, revealLines, useGsap } from '@/composables/useMotion'

const icons = {
  sun: Sun,
  droplets: Droplets,
  sprout: Sprout,
  plug: PlugZap,
  activity: Activity,
  compass: Compass,
}

const activeIdx = ref(0)
/** En móvil funciona como acordeón (puede quedar todo cerrado). */
const openIdx = ref<number | null>(0)
const active = computed(() => solutions[activeIdx.value]!)

function select(i: number) {
  activeIdx.value = i
}
function toggle(i: number) {
  openIdx.value = openIdx.value === i ? null : i
  activeIdx.value = i
}
function ask(id: string) {
  selectedSolution.value = id
  scrollToId('contacto')
}

const root = ref<HTMLElement | null>(null)
useGsap(root, (mm, el) => {
  mm.add(MQ.motion, () => {
    const q = gsap.utils.selector(el)
    const s = revealLines(q('[data-lines]')[0]!)
    gsap.from(q('.sol-item'), {
      y: 60,
      autoAlpha: 0,
      stagger: 0.08,
      duration: 1.2,
      scrollTrigger: { trigger: q('.sol-list')[0], start: 'top 82%', once: true },
    })
    gsap.fromTo(
      q('.sol-stage')[0] ?? [],
      { clipPath: 'inset(0% 0% 100% 0%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.6,
        ease: 'expo.inOut',
        scrollTrigger: { trigger: q('.sol-list')[0], start: 'top 75%', once: true },
      },
    )
    return () => s.revert()
  })
})
</script>

<template>
  <section
    id="soluciones"
    ref="root"
    class="sol relative bg-blue py-[var(--section-y)] text-paper"
    aria-labelledby="sol-title"
  >
    <div class="sol-glow pointer-events-none absolute inset-0" aria-hidden="true" />
    <div class="container-x relative">
      <div class="grid gap-8 lg:grid-cols-12">
        <div class="lg:col-span-7">
          <SectionLabel index="02" label="Soluciones energéticas" />
          <h2 id="sol-title" data-lines class="display-lg mt-8 max-w-[15ch] text-balance">
            Una solución para cada forma de usar la
            <em class="serif-accent text-accent">energía.</em>
          </h2>
        </div>
        <p class="lead self-end text-paper/75 lg:col-span-4 lg:col-start-9">
          Explora nuestro portafolio y encuentra la solución que se ajusta a tu operación. Cada
          proyecto se dimensiona según sus propias condiciones.
        </p>
      </div>

      <div class="mt-16 grid gap-10 md:mt-24 lg:grid-cols-12 lg:gap-8">
        <!-- Lista -->
        <ul class="sol-list border-t border-white/15 lg:col-span-6" role="list">
          <li v-for="(s, i) in solutions" :key="s.id" class="sol-item border-b border-white/15">
            <!-- Desktop: selector -->
            <button
              type="button"
              class="sol-btn hidden lg:flex"
              :class="{ 'is-active': activeIdx === i }"
              :aria-pressed="activeIdx === i"
              :aria-controls="'sol-stage'"
              @pointerenter="select(i)"
              @focus="select(i)"
              @click="select(i)"
            >
              <span class="mono w-12 shrink-0 text-left text-mute">{{
                String(i + 1).padStart(2, '0')
              }}</span>
              <span class="sol-title">{{ s.title }}</span>
              <span class="sol-arrow" aria-hidden="true"
                ><ArrowUpRight :size="22" :stroke-width="1.5"
              /></span>
            </button>

            <!-- Móvil: acordeón -->
            <button
              :id="`sol-h-${s.id}`"
              type="button"
              class="sol-btn flex lg:hidden"
              :aria-expanded="openIdx === i"
              :aria-controls="`sol-p-${s.id}`"
              @click="toggle(i)"
            >
              <span class="mono w-10 shrink-0 text-left text-mute">{{
                String(i + 1).padStart(2, '0')
              }}</span>
              <span class="sol-title">{{ s.title }}</span>
              <span class="sol-plus" :class="{ 'is-open': openIdx === i }" aria-hidden="true">
                <Plus :size="20" :stroke-width="1.5" />
              </span>
            </button>
            <div
              :id="`sol-p-${s.id}`"
              role="region"
              :aria-labelledby="`sol-h-${s.id}`"
              class="acc lg:hidden"
              :class="{ 'is-open': openIdx === i }"
            >
              <div class="acc-inner">
                <div class="pb-8">
                  <div v-if="s.image" class="aspect-[16/10] overflow-hidden">
                    <ResponsiveImage :image="s.image" sizes="100vw" show-tag tag-position="br" />
                  </div>
                  <p class="mt-5 text-paper/80">{{ s.description }}</p>
                  <button type="button" class="ask mt-5" @click="ask(s.id)">
                    Solicitar información <ArrowUpRight :size="16" />
                  </button>
                </div>
              </div>
            </div>
          </li>
        </ul>

        <!-- Escenario visual (desktop) -->
        <div class="hidden lg:col-span-6 lg:block">
          <div id="sol-stage" class="sol-stage sticky top-28" aria-live="polite">
            <div class="relative aspect-[5/4] overflow-hidden bg-ink">
              <div
                v-for="(s, i) in solutions"
                :key="s.id"
                class="stage-img"
                :class="{ 'is-active': activeIdx === i, 'is-before': i < activeIdx }"
                :aria-hidden="activeIdx !== i"
              >
                <ResponsiveImage
                  v-if="s.image"
                  :image="s.image"
                  sizes="(min-width: 1024px) 46vw, 1px"
                  show-tag
                  tag-position="tl"
                />
                <div v-else class="grid h-full place-items-center bg-blue-deep">
                  <component
                    :is="icons[s.icon]"
                    :size="80"
                    :stroke-width="0.8"
                    class="text-accent/60"
                  />
                </div>
              </div>
              <div class="stage-shade" aria-hidden="true" />
              <div class="absolute inset-x-0 bottom-0 flex items-end justify-between p-7">
                <span class="stage-icon">
                  <component :is="icons[active.icon]" :size="24" :stroke-width="1.5" />
                </span>
                <span class="mono text-paper/70">{{ active.short }}</span>
              </div>
            </div>
            <div class="mt-7 grid grid-cols-[1fr_auto] items-start gap-8">
              <p class="text-[1.075rem] text-paper/80">
                <span class="sr-only">{{ active.title }}: </span>{{ active.description }}
              </p>
              <button type="button" class="ask" @click="ask(active.id)">
                Solicitar información <ArrowUpRight :size="16" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sol-glow {
  background:
    radial-gradient(50% 40% at 100% 0%, rgb(91 155 255 / 0.12), transparent 70%),
    radial-gradient(60% 50% at 0% 100%, rgb(6 20 46 / 0.7), transparent 70%);
}
.sol-btn {
  position: relative;
  width: 100%;
  align-items: center;
  gap: 0.75rem;
  padding: 1.6rem 0;
  text-align: left;
  color: rgb(255 255 255 / 0.55);
  transition: color 0.5s var(--ease-out-expo);
}
.sol-btn::before {
  content: '';
  position: absolute;
  left: 0;
  bottom: -1px;
  height: 1px;
  width: 100%;
  background: var(--color-accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.9s var(--ease-out-expo);
}
.sol-btn.is-active,
.sol-btn[aria-expanded='true'],
.sol-btn:hover {
  color: var(--color-paper);
}
.sol-btn.is-active::before,
.sol-btn[aria-expanded='true']::before {
  transform: scaleX(1);
}
.sol-title {
  flex: 1;
  font-family: var(--font-display);
  font-variation-settings: 'wdth' 108;
  font-weight: 500;
  font-size: clamp(1.4rem, 1rem + 1.6vw, 2.35rem);
  line-height: 1.08;
  letter-spacing: -0.025em;
  transition: transform 0.7s var(--ease-out-expo);
}
.sol-btn.is-active .sol-title {
  transform: translateX(0.6rem);
}
.sol-arrow {
  color: var(--color-accent);
  opacity: 0;
  transform: translate(-0.6rem, 0.6rem);
  transition:
    opacity 0.5s,
    transform 0.7s var(--ease-out-expo);
}
.sol-btn.is-active .sol-arrow {
  opacity: 1;
  transform: none;
}
.sol-plus {
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 999px;
  border: 1px solid rgb(255 255 255 / 0.25);
  transition:
    transform 0.6s var(--ease-out-expo),
    background 0.4s,
    color 0.4s;
}
.sol-plus.is-open {
  transform: rotate(135deg);
  background: var(--color-accent);
  color: var(--color-ink);
  border-color: var(--color-accent);
}
.acc {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.7s var(--ease-out-expo);
}
.acc.is-open {
  grid-template-rows: 1fr;
}
@media (min-width: 1024px) {
  .acc {
    display: none;
  }
}
.acc-inner {
  overflow: hidden;
  visibility: hidden;
  transition: visibility 0.7s;
}
.acc.is-open .acc-inner {
  visibility: visible;
}
.stage-img {
  position: absolute;
  inset: 0;
  clip-path: inset(0% 0% 0% 100%);
  transition: clip-path 1.1s var(--ease-in-out-quart);
  z-index: 1;
}
.stage-img :deep(img) {
  transform: scale(1.18);
  transition: transform 1.6s var(--ease-out-expo);
}
.stage-img.is-before {
  clip-path: inset(0% 100% 0% 0%);
}
.stage-img.is-active {
  clip-path: inset(0% 0% 0% 0%);
  z-index: 2;
}
.stage-img.is-active :deep(img) {
  transform: scale(1);
}
.stage-shade {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  background: linear-gradient(to top, rgb(6 20 46 / 0.75), transparent 45%);
}
.stage-shade + div {
  z-index: 4;
}
.stage-icon {
  display: grid;
  place-items: center;
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 999px;
  background: var(--color-accent);
  color: var(--color-ink);
}
.ask {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  white-space: nowrap;
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--color-accent);
  padding-bottom: 0.2rem;
  border-bottom: 1px solid rgb(91 155 255 / 0.4);
  transition: border-color 0.3s;
}
.ask:hover {
  border-color: var(--color-accent);
}
</style>
