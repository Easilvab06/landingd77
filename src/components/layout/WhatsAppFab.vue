<script setup lang="ts">
/**
 * Botón flotante de WhatsApp: aparece tras el hero con un "pop" elástico,
 * emite ondas de pulso, el icono se dibuja y se despliega una etiqueta al pasar el cursor.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'
import SocialButton from '@/components/ui/SocialButton.vue'
import { site, socialLinks } from '@/config/site'
import { gsap, prefersReducedMotion } from '@/composables/useMotion'

const wa = socialLinks().find((s) => s.network === 'whatsapp') ?? {
  network: 'whatsapp' as const,
  label: 'WhatsApp',
  href: 'https://wa.me/',
}
const visible = ref(false)
const root = ref<HTMLElement | null>(null)
const btn = ref<InstanceType<typeof SocialButton> | null>(null)

const onScroll = () => {
  const show = window.scrollY > window.innerHeight * 0.6
  if (show === visible.value) return
  visible.value = show
  if (!root.value) return
  if (prefersReducedMotion()) return
  if (show) {
    gsap.fromTo(
      root.value,
      { scale: 0, rotate: -40, autoAlpha: 0 },
      { scale: 1, rotate: 0, autoAlpha: 1, duration: 1, ease: 'elastic.out(1, 0.5)' },
    )
    btn.value?.draw(0.2, 0.9)
  } else {
    gsap.to(root.value, { scale: 0, autoAlpha: 0, duration: 0.35, ease: 'power3.in' })
  }
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <div
    v-if="site.whatsappFab"
    ref="root"
    class="fab"
    :class="{ 'is-visible': visible }"
    :inert="!visible || undefined"
  >
    <span class="fab-ring" aria-hidden="true" />
    <span class="fab-ring fab-ring--2" aria-hidden="true" />
    <span class="fab-label" aria-hidden="true">¿Hablamos?</span>
    <SocialButton
      ref="btn"
      :link="{ ...wa, label: 'Escríbenos por WhatsApp' }"
      size="lg"
      class="fab-btn"
    />
  </div>
</template>

<style scoped>
.fab {
  position: fixed;
  right: max(1rem, env(safe-area-inset-right));
  bottom: max(1rem, env(safe-area-inset-bottom));
  z-index: 45;
  display: grid;
  place-items: center;
  opacity: 0;
  visibility: hidden;
}
.fab.is-visible {
  opacity: 1;
  visibility: visible;
}
@media (prefers-reduced-motion: no-preference) {
  .fab {
    transition: none;
  }
}
.fab .fab-btn {
  --liquid: var(--color-paper);
  --fg: var(--color-ink);
  --fg-hover: var(--color-ink);
  --bd: var(--color-accent);
  background: var(--color-accent);
  box-shadow: 0 12px 30px -8px rgb(91 155 255 / 0.55);
}
.fab .fab-btn :deep(.sbtn-tip) {
  display: none;
}
.fab-ring {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  border: 2px solid var(--color-accent);
  pointer-events: none;
  animation: ring 2.6s cubic-bezier(0.2, 0.6, 0.3, 1) infinite;
}
.fab-ring--2 {
  animation-delay: 1.3s;
}
@keyframes ring {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1.9);
    opacity: 0;
  }
}
.fab-label {
  position: absolute;
  right: calc(100% + 0.75rem);
  padding: 0.55rem 0.9rem;
  border-radius: 999px;
  background: var(--color-paper);
  color: var(--color-ink);
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: 0 10px 30px -10px rgb(6 20 46 / 0.4);
  opacity: 0;
  transform: translateX(10px);
  pointer-events: none;
  transition:
    opacity 0.3s ease,
    transform 0.5s var(--ease-out-expo);
}
.fab:hover .fab-label,
.fab:focus-within .fab-label {
  opacity: 1;
  transform: none;
}
@media (prefers-reduced-motion: reduce) {
  .fab-ring {
    display: none;
  }
}
</style>
