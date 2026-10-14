<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Menu, X } from '@lucide/vue'
import BrandLogo from '@/components/ui/BrandLogo.vue'
import MagneticButton from '@/components/ui/MagneticButton.vue'
import SocialLinks from '@/components/ui/SocialLinks.vue'
import { navLinks, site } from '@/config/site'
import { useActiveSection } from '@/composables/useActiveSection'
import { gsap, prefersReducedMotion } from '@/composables/useMotion'
import { startScroll, stopScroll } from '@/composables/useSmoothScroll'

const active = useActiveSection(navLinks.map((l) => l.id))
const scrolled = ref(false)
const hidden = ref(false)
const open = ref(false)
const panel = ref<HTMLElement | null>(null)
const toggleBtn = ref<HTMLButtonElement | null>(null)

let lastY = 0
const onScroll = () => {
  const y = window.scrollY
  scrolled.value = y > 40
  // Oculta al bajar, muestra al subir (nunca con el menú abierto)
  hidden.value = !open.value && y > window.innerHeight * 0.9 && y > lastY + 4
  if (y < lastY - 4) hidden.value = false
  lastY = y
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKey)
  startScroll()
})

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
  if (e.key === 'Tab' && panel.value) {
    // Trampa de foco dentro del menú móvil
    const f = panel.value.querySelectorAll<HTMLElement>('a, button')
    const first = toggleBtn.value!
    const last = f[f.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last?.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }
}

watch(open, async (isOpen) => {
  if (isOpen) {
    stopScroll()
    window.addEventListener('keydown', onKey)
    await nextTick()
    if (!prefersReducedMotion() && panel.value) {
      gsap.fromTo(
        panel.value,
        { clipPath: 'inset(0% 0% 100% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'expo.inOut' },
      )
      gsap.from(panel.value.querySelectorAll('[data-m-item]'), {
        yPercent: 120,
        duration: 1,
        stagger: 0.06,
        delay: 0.35,
        ease: 'expo.out',
      })
    }
    panel.value?.querySelector<HTMLElement>('a')?.focus()
  } else {
    window.removeEventListener('keydown', onKey)
    startScroll()
  }
})

function close() {
  if (!open.value) return
  open.value = false
  toggleBtn.value?.focus()
}
</script>

<template>
  <a
    href="#contenido"
    class="sr-only-focusable fixed left-4 top-4 z-[100] bg-accent px-4 py-2 text-ink"
  >
    Saltar al contenido
  </a>

  <header
    data-site-header
    class="header fixed inset-x-0 top-0 z-50"
    :class="{ 'is-scrolled': scrolled && !open, 'is-open': open, 'is-hidden': hidden && !open }"
  >
    <div class="container-x flex h-[var(--header-h)] items-center justify-between gap-6">
      <a
        href="#inicio"
        class="relative z-10 shrink-0"
        :aria-label="`${site.name} — inicio`"
        @click="close"
      >
        <BrandLogo />
      </a>

      <nav aria-label="Principal" class="hidden lg:block">
        <ul class="flex items-center gap-1 xl:gap-2">
          <li v-for="link in navLinks" :key="link.id">
            <a
              :href="`#${link.id}`"
              class="nav-link"
              :class="{ 'is-active': active === link.id }"
              :aria-current="active === link.id ? 'location' : undefined"
            >
              {{ link.label }}
            </a>
          </li>
        </ul>
      </nav>

      <div class="relative z-10 flex items-center gap-2">
        <span class="hidden sm:inline-flex">
          <MagneticButton href="#contacto" icon="up-right">Solicitar asesoría</MagneticButton>
        </span>
        <a
          href="#contacto"
          class="grid h-11 place-items-center rounded-full bg-accent px-4 text-sm font-semibold text-ink sm:hidden"
          @click="close"
        >
          Asesoría
        </a>
        <button
          ref="toggleBtn"
          type="button"
          class="menu-btn lg:hidden"
          :aria-expanded="open"
          aria-controls="menu-movil"
          :aria-label="open ? 'Cerrar menú' : 'Abrir menú'"
          @click="open = !open"
        >
          <X v-if="open" :size="22" :stroke-width="1.5" />
          <Menu v-else :size="22" :stroke-width="1.5" />
        </button>
      </div>
    </div>

    <!-- Menú móvil -->
    <div
      v-if="open"
      id="menu-movil"
      ref="panel"
      class="mobile-panel lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Menú de navegación"
    >
      <nav aria-label="Móvil" class="container-x flex h-full flex-col justify-between pb-10 pt-28">
        <ul class="space-y-1">
          <li v-for="(link, i) in navLinks" :key="link.id" class="overflow-hidden">
            <a
              :href="`#${link.id}`"
              data-m-item
              class="m-link"
              :class="{ 'text-accent': active === link.id }"
              @click="close"
            >
              <span class="mono mr-4 align-top text-mute">0{{ i + 1 }}</span
              >{{ link.label }}
            </a>
          </li>
        </ul>
        <div class="overflow-hidden">
          <div data-m-item class="flex flex-wrap items-center gap-4 border-t border-white/10 pt-6">
            <SocialLinks size="sm" :animate="false" label="Redes sociales" />
            <p class="w-full text-sm text-mute">{{ site.tagline }}</p>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  transition:
    transform 0.7s var(--ease-out-expo),
    background-color 0.6s ease,
    border-color 0.6s ease,
    backdrop-filter 0.6s ease;
  border-bottom: 1px solid transparent;
}
.header.is-scrolled {
  background: rgb(6 20 46 / 0.78);
  backdrop-filter: blur(14px) saturate(1.3);
  -webkit-backdrop-filter: blur(14px) saturate(1.3);
  border-color: var(--line-dark);
}
.header.is-open {
  /* sin backdrop-filter: si no, el panel fijo quedaría contenido en la cabecera */
  background: transparent;
  backdrop-filter: none;
}
.header.is-hidden {
  transform: translateY(-100%);
}
.nav-link {
  position: relative;
  display: inline-block;
  padding: 0.6rem 0.85rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: rgb(255 255 255 / 0.72);
  transition: color 0.4s ease;
}
.nav-link::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 0.2rem;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--color-accent);
  transform: translateX(-50%) scale(0);
  transition: transform 0.5s var(--ease-out-expo);
}
.nav-link:hover,
.nav-link:focus-visible,
.nav-link.is-active {
  color: var(--color-paper);
}
.nav-link.is-active::after {
  transform: translateX(-50%) scale(1);
}
.menu-btn {
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 999px;
  border: 1px solid rgb(255 255 255 / 0.25);
  color: var(--color-paper);
  transition: border-color 0.3s;
}
@media (min-width: 1024px) {
  .menu-btn {
    display: none;
  }
}
.menu-btn:hover {
  border-color: var(--color-accent);
}
.mobile-panel {
  position: fixed;
  inset: 0;
  z-index: 0;
  height: 100dvh;
  background:
    radial-gradient(60% 40% at 90% 100%, rgb(91 155 255 / 0.14), transparent 70%), var(--color-ink);
}
.m-link {
  display: block;
  font-family: var(--font-display);
  font-variation-settings: 'wdth' 110;
  font-weight: 500;
  font-size: clamp(2.2rem, 10vw, 3.6rem);
  line-height: 1.12;
  letter-spacing: -0.03em;
  color: var(--color-paper);
}
</style>
