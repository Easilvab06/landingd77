<script setup lang="ts">
import { ref } from 'vue'
import { ArrowUp } from '@lucide/vue'
import BrandLogo from '@/components/ui/BrandLogo.vue'
import SocialLinks from '@/components/ui/SocialLinks.vue'
import { navLinks, site } from '@/config/site'
import { solutions } from '@/data/solutions'
import { projects } from '@/data/projects'
import { scrollToId } from '@/composables/useSmoothScroll'
import { gsap, MQ, useGsap } from '@/composables/useMotion'

const year = new Date().getFullYear()
const letters = site.name.toLowerCase().replace(/\s+/g, '').split('')
const half = Math.ceil(letters.length / 2)

const root = ref<HTMLElement | null>(null)
useGsap(root, (mm, el) => {
  mm.add(MQ.motion, () => {
    gsap.from(el.querySelectorAll('.wm-l'), {
      yPercent: 100,
      stagger: 0.05,
      duration: 1.4,
      ease: 'expo.out',
      scrollTrigger: { trigger: el.querySelector('.wordmark'), start: 'top 95%', once: true },
    })
    gsap.from(el.querySelectorAll('[data-f]'), {
      y: 30,
      autoAlpha: 0,
      stagger: 0.06,
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    })
  })
})
</script>

<template>
  <footer
    ref="root"
    class="relative overflow-hidden bg-ink pt-24 text-paper md:pt-32"
    aria-label="Pie de página"
  >
    <div class="container-x">
      <div
        class="grid gap-14 border-b border-white/10 pb-16 md:grid-cols-2 lg:grid-cols-12 lg:gap-8"
      >
        <div class="lg:col-span-4" data-f>
          <BrandLogo />
          <p class="mt-6 max-w-sm text-paper/65">{{ site.description }}</p>
          <p class="mono mt-10 text-mute">Síguenos</p>
          <SocialLinks class="mt-5" />
        </div>

        <nav class="lg:col-span-2" aria-label="Enlaces del pie" data-f>
          <p class="mono text-mute">Navegación</p>
          <ul class="mt-5 space-y-3">
            <li v-for="l in navLinks" :key="l.id">
              <a :href="`#${l.id}`" class="link-underline text-paper/80 hover:text-paper">{{
                l.label
              }}</a>
            </li>
          </ul>
        </nav>

        <div class="lg:col-span-3" data-f>
          <p class="mono text-mute">Soluciones</p>
          <ul class="mt-5 space-y-3">
            <li v-for="s in solutions" :key="s.id">
              <a href="#soluciones" class="link-underline text-paper/80 hover:text-paper">{{
                s.title
              }}</a>
            </li>
          </ul>
        </div>

        <div class="lg:col-span-3" data-f>
          <p class="mono text-mute">Proyectos</p>
          <ul class="mt-5 space-y-3">
            <li v-for="p in projects.slice(0, 4)" :key="p.id">
              <a href="#proyectos" class="link-underline text-paper/80 hover:text-paper">{{
                p.name
              }}</a>
            </li>
          </ul>

          <template v-if="site.channels.length">
            <p class="mono mt-10 text-mute">Contacto</p>
            <ul class="mt-5 space-y-3">
              <li v-for="c in site.channels" :key="c.value" class="text-paper/80">{{ c.value }}</li>
            </ul>
          </template>
        </div>
      </div>

      <div
        class="flex flex-col gap-6 py-8 text-sm text-mute md:flex-row md:items-center md:justify-between"
      >
        <p>© {{ year }} {{ site.name }}. Todos los derechos reservados.</p>
        <ul v-if="site.legal.length" class="flex flex-wrap gap-6">
          <li v-for="l in site.legal" :key="l.href">
            <a :href="l.href" class="link-underline">{{ l.label }}</a>
          </li>
        </ul>
        <button
          type="button"
          class="inline-flex items-center gap-2 text-paper/80 hover:text-accent"
          @click="scrollToId('inicio')"
        >
          Volver arriba <ArrowUp :size="16" />
        </button>
      </div>
    </div>

    <!-- Marca monumental -->
    <div
      class="wordmark"
      aria-hidden="true"
      :style="{ fontSize: `${Math.min(19.5, 165 / letters.length)}vw` }"
    >
      <span v-for="(l, i) in letters" :key="i" class="wm-mask"
        ><span class="wm-l" :class="{ 'is-accent': i >= half }">{{ l }}</span></span
      >
    </div>
  </footer>
</template>

<style scoped>
.wordmark {
  display: flex;
  justify-content: center;
  padding-inline: 1vw;
  margin-bottom: -0.17em;
  font-family: var(--font-display);
  font-variation-settings: 'wdth' 125;
  font-weight: 600;
  font-size: 19.5vw;
  line-height: 0.85;
  letter-spacing: -0.06em;
  user-select: none;
}
.wm-mask {
  display: inline-block;
  overflow: hidden;
  padding-top: 0.04em;
}
.wm-l {
  display: inline-block;
  background: linear-gradient(to bottom, rgb(255 255 255 / 0.14), rgb(255 255 255 / 0.02) 85%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.wm-l.is-accent {
  background-image: linear-gradient(to bottom, rgb(91 155 255 / 0.55), rgb(91 155 255 / 0.03) 85%);
}
</style>
