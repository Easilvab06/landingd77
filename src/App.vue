<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import SiteHeader from '@/components/layout/SiteHeader.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import ScrollProgress from '@/components/layout/ScrollProgress.vue'
import IntroCurtain from '@/components/layout/IntroCurtain.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import ValueStrip from '@/components/sections/ValueStrip.vue'
import AboutSection from '@/components/sections/AboutSection.vue'
import SolutionsSection from '@/components/sections/SolutionsSection.vue'
import ProjectsSection from '@/components/sections/ProjectsSection.vue'
import ImpactSection from '@/components/sections/ImpactSection.vue'
import ProcessSection from '@/components/sections/ProcessSection.vue'
import CtaSection from '@/components/sections/CtaSection.vue'
import ContactSection from '@/components/sections/ContactSection.vue'
import StorySection from '@/components/sections/StorySection.vue'
import WhatsAppFab from '@/components/layout/WhatsAppFab.vue'
import { ScrollTrigger } from '@/composables/useMotion'
import {
  destroySmoothScroll,
  handleAnchorClick,
  initSmoothScroll,
  scrollToId,
} from '@/composables/useSmoothScroll'

const ready = ref(false)

onMounted(() => {
  initSmoothScroll()
  document.addEventListener('click', handleAnchorClick)
  // Recalcula posiciones cuando terminan de cargar fuentes e imágenes
  document.fonts?.ready.then(() => ScrollTrigger.refresh())
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true })
  // Enlace profundo (#contacto, etc.)
  const hash = location.hash.slice(1)
  if (hash) setTimeout(() => scrollToId(hash), 400)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleAnchorClick)
  destroySmoothScroll()
})
</script>

<template>
  <IntroCurtain @done="ready = true" />
  <ScrollProgress />
  <SiteHeader />
  <main id="contenido">
    <HeroSection :ready="ready" />
    <ValueStrip />
    <AboutSection />
    <SolutionsSection />
    <ProjectsSection />
    <StorySection />
    <ImpactSection />
    <ProcessSection />
    <CtaSection />
    <ContactSection />
  </main>
  <SiteFooter />
  <WhatsAppFab />
</template>
