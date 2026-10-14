<script setup lang="ts">
/**
 * Telón de apertura: un horizonte de luz se dibuja, el sol asoma y el telón
 * se abre revelando el hero. ~1,6 s, solo en la primera visita de la sesión,
 * nunca con movimiento reducido. No bloquea el scroll ni los clics.
 */
import { onMounted, ref } from 'vue'
import { gsap, prefersReducedMotion } from '@/composables/useMotion'
import { site } from '@/config/site'

const emit = defineEmits<{ done: [] }>()
const show = ref(true)
const root = ref<HTMLElement | null>(null)

onMounted(() => {
  let seen = false
  try {
    seen = sessionStorage.getItem('intro-visto') === '1'
    sessionStorage.setItem('intro-visto', '1')
  } catch {
    /* almacenamiento no disponible */
  }
  if (seen || prefersReducedMotion() || !root.value) {
    show.value = false
    emit('done')
    return
  }
  const q = gsap.utils.selector(root.value)
  gsap
    .timeline({
      defaults: { ease: 'expo.inOut' },
      onComplete: () => {
        show.value = false
      },
    })
    .fromTo(q('.c-line'), { scaleX: 0 }, { scaleX: 1, duration: 0.9 })
    .fromTo(q('.c-sun'), { yPercent: 100 }, { yPercent: 0, duration: 0.8, ease: 'expo.out' }, 0.45)
    .fromTo(q('.c-word'), { yPercent: 110 }, { yPercent: 0, duration: 0.8, ease: 'expo.out' }, 0.55)
    .add(() => emit('done'), 1.05)
    .to(q('.c-top'), { yPercent: -100, duration: 1.1 }, 1.15)
    .to(q('.c-bottom'), { yPercent: 100, duration: 1.1 }, 1.15)
    .to(q('.c-center'), { autoAlpha: 0, duration: 0.4, ease: 'power2.out' }, 1.15)
})
</script>

<template>
  <div v-if="show" ref="root" class="curtain" aria-hidden="true">
    <div class="c-top" />
    <div class="c-bottom" />
    <div class="c-center">
      <div class="c-sun-wrap"><div class="c-sun" /></div>
      <div class="c-line" />
      <div class="c-word-wrap">
        <span class="c-word">{{ site.name }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.curtain {
  position: fixed;
  inset: 0;
  z-index: 90;
  pointer-events: none;
}
.c-top,
.c-bottom {
  position: absolute;
  left: 0;
  right: 0;
  height: 50.5%;
  background: var(--color-ink);
}
.c-top {
  top: 0;
}
.c-bottom {
  bottom: 0;
}
.c-center {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
}
.c-line {
  position: absolute;
  top: 50%;
  left: 8vw;
  right: 8vw;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-accent), transparent);
  transform-origin: center;
}
.c-sun-wrap {
  position: absolute;
  bottom: 50%;
  width: 4.5rem;
  height: 2.25rem;
  overflow: hidden;
}
.c-sun {
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 50%;
  background: radial-gradient(circle, var(--color-accent-soft), var(--color-accent) 60%);
  box-shadow: 0 0 80px 20px rgb(91 155 255 / 0.35);
}
.c-word-wrap {
  position: absolute;
  top: calc(50% + 1.25rem);
  overflow: hidden;
}
.c-word {
  display: block;
  font-family: var(--font-display);
  font-variation-settings: 'wdth' 125;
  font-weight: 500;
  font-size: 0.85rem;
  letter-spacing: 0.6em;
  text-transform: uppercase;
  color: var(--color-mute);
  padding-left: 0.6em;
}
</style>
