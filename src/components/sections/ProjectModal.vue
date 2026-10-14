<script setup lang="ts">
/**
 * Ficha de proyecto accesible basada en <dialog> nativo
 * (gestión de foco, Escape y fondo inerte incluidos).
 * Solo muestra los datos documentados del proyecto.
 */
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { X, ChevronLeft, ChevronRight } from '@lucide/vue'
import ResponsiveImage from '@/components/ui/ResponsiveImage.vue'
import MagneticButton from '@/components/ui/MagneticButton.vue'
import type { Project } from '@/types'
import { gsap, prefersReducedMotion } from '@/composables/useMotion'
import { scrollToId, startScroll, stopScroll } from '@/composables/useSmoothScroll'

const props = defineProps<{ project: Project | null }>()
const emit = defineEmits<{ close: [] }>()

const dialog = ref<HTMLDialogElement | null>(null)
const slide = ref(0)
const p = ref<Project | null>(null)

const specs = computed(() => {
  if (!p.value) return []
  return [
    { label: 'Ubicación', value: p.value.location },
    { label: 'Tipo de instalación', value: p.value.installationType },
    { label: 'Potencia instalada', value: p.value.power },
  ].filter((s): s is { label: string; value: string } => Boolean(s.value))
})
const hasReferential = computed(() => p.value?.gallery.some((g) => g.referential))

watch(
  () => props.project,
  async (proj) => {
    if (proj) {
      p.value = proj
      slide.value = 0
      await nextTick()
      dialog.value?.showModal()
      stopScroll()
      if (!prefersReducedMotion()) {
        gsap.fromTo(
          dialog.value!.querySelector('.md-panel'),
          { clipPath: 'inset(100% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'expo.inOut' },
        )
        gsap.from(dialog.value!.querySelectorAll('[data-md]'), {
          y: 30,
          autoAlpha: 0,
          stagger: 0.06,
          delay: 0.45,
        })
      }
    } else if (dialog.value?.open) {
      dialog.value.close()
    }
  },
)

function requestClose() {
  if (!dialog.value?.open) return
  const finish = () => {
    dialog.value?.close()
  }
  if (prefersReducedMotion()) return finish()
  gsap.to(dialog.value.querySelector('.md-panel'), {
    clipPath: 'inset(0% 0% 100% 0%)',
    duration: 0.7,
    ease: 'expo.inOut',
    onComplete: finish,
  })
}

let pendingTarget = ''
function goContact() {
  pendingTarget = 'contacto'
  requestClose()
}
function onClosed() {
  startScroll()
  emit('close')
  if (pendingTarget) {
    const id = pendingTarget
    pendingTarget = ''
    requestAnimationFrame(() => scrollToId(id))
  }
}
function onCancel(e: Event) {
  e.preventDefault()
  requestClose()
}
function onBackdrop(e: MouseEvent) {
  if (e.target === dialog.value) requestClose()
}
function go(dir: number) {
  if (!p.value) return
  const n = p.value.gallery.length
  slide.value = (slide.value + dir + n) % n
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'ArrowRight') go(1)
  if (e.key === 'ArrowLeft') go(-1)
}

onBeforeUnmount(() => {
  if (dialog.value?.open) {
    dialog.value.close()
    startScroll()
  }
})
</script>

<template>
  <dialog
    ref="dialog"
    class="md"
    :aria-labelledby="p ? `md-title-${p.id}` : undefined"
    data-lenis-prevent
    @close="onClosed"
    @cancel="onCancel"
    @click="onBackdrop"
  >
    <div v-if="p" class="md-panel" @keydown="onKey">
      <div class="md-head container-x flex items-center justify-between py-5">
        <span class="mono text-mute">Ficha de proyecto</span>
        <button
          type="button"
          class="md-close"
          aria-label="Cerrar ficha del proyecto"
          @click="requestClose"
        >
          <X :size="22" :stroke-width="1.5" />
        </button>
      </div>

      <div class="container-x grid gap-10 pb-14 lg:grid-cols-12 lg:gap-8">
        <!-- Galería -->
        <div class="lg:col-span-8" data-md>
          <div
            class="relative aspect-[16/10] overflow-hidden bg-blue-deep"
            role="group"
            aria-roledescription="carrusel"
            :aria-label="`Galería de ${p.name}`"
          >
            <div
              v-for="(img, i) in p.gallery"
              :key="`${img.name}-${i}`"
              class="md-slide"
              :class="{ 'is-active': slide === i }"
              role="group"
              aria-roledescription="diapositiva"
              :aria-label="`${i + 1} de ${p.gallery.length}`"
              :aria-hidden="slide !== i"
            >
              <ResponsiveImage
                :image="img"
                sizes="(min-width: 1024px) 64vw, 100vw"
                show-tag
                tag-position="tl"
              />
            </div>
          </div>
          <div v-if="p.gallery.length > 1" class="mt-4 flex items-center justify-between">
            <span class="mono tabular-nums text-mute" aria-live="polite">
              {{ String(slide + 1).padStart(2, '0') }} /
              {{ String(p.gallery.length).padStart(2, '0') }}
            </span>
            <div class="flex gap-2">
              <button type="button" class="md-nav" aria-label="Imagen anterior" @click="go(-1)">
                <ChevronLeft :size="20" />
              </button>
              <button type="button" class="md-nav" aria-label="Imagen siguiente" @click="go(1)">
                <ChevronRight :size="20" />
              </button>
            </div>
          </div>
        </div>

        <!-- Información -->
        <div class="flex flex-col gap-8 lg:col-span-4">
          <div data-md>
            <h2 :id="`md-title-${p.id}`" class="display-md">{{ p.name }}</h2>
            <p v-if="p.description" class="mt-5 text-paper/80">{{ p.description }}</p>
          </div>

          <dl v-if="specs.length" data-md class="border-t border-white/15">
            <div
              v-for="s in specs"
              :key="s.label"
              class="grid grid-cols-2 gap-4 border-b border-white/15 py-4"
            >
              <dt class="mono pt-1 text-mute">{{ s.label }}</dt>
              <dd>{{ s.value }}</dd>
            </div>
          </dl>

          <div v-if="p.results?.length" data-md>
            <p class="mono text-accent">Resultados</p>
            <ul class="mt-3 space-y-2 text-paper/80">
              <li v-for="r in p.results" :key="r">{{ r }}</li>
            </ul>
          </div>

          <p v-if="hasReferential" data-md class="text-sm text-mute">
            Las imágenes de esta ficha son referenciales y se reemplazarán por el registro
            fotográfico del proyecto.
          </p>

          <div data-md>
            <MagneticButton @click="goContact">Quiero un proyecto así</MagneticButton>
          </div>
        </div>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
.md {
  width: 100%;
  max-width: none;
  height: 100%;
  max-height: none;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--color-paper);
  overflow: hidden;
}
.md::backdrop {
  background: rgb(6 20 46 / 0.7);
  backdrop-filter: blur(6px);
}
.md-panel {
  position: absolute;
  inset: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  background:
    radial-gradient(50% 40% at 100% 0%, rgb(91 155 255 / 0.1), transparent 70%), var(--color-ink);
}
@media (min-width: 1024px) {
  .md-panel {
    inset: 2rem;
    border: 1px solid var(--line-dark);
  }
}
.md-head {
  position: sticky;
  top: 0;
  z-index: 5;
  background: rgb(6 20 46 / 0.85);
  backdrop-filter: blur(10px);
}
.md-close,
.md-nav {
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  border-radius: 999px;
  border: 1px solid rgb(255 255 255 / 0.25);
  transition:
    background 0.3s,
    color 0.3s,
    transform 0.6s var(--ease-out-expo);
}
.md-close:hover {
  background: var(--color-accent);
  color: var(--color-ink);
  transform: rotate(90deg);
}
.md-nav:hover {
  background: var(--color-paper);
  color: var(--color-ink);
}
.md-slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transform: scale(1.04);
  transition:
    opacity 0.8s var(--ease-out-expo),
    transform 1.2s var(--ease-out-expo);
}
.md-slide.is-active {
  opacity: 1;
  transform: none;
}
</style>
