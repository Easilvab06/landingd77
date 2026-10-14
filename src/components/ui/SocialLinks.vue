<script setup lang="ts">
/** Grupo de botones sociales con entrada en escena escalonada (pop + dibujo del trazo). */
import { ref } from 'vue'
import SocialButton from './SocialButton.vue'
import { socialLinks } from '@/config/site'
import { gsap, MQ, ScrollTrigger, useGsap } from '@/composables/useMotion'

const props = withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg'
    tone?: 'dark' | 'light'
    label?: string
    animate?: boolean
  }>(),
  { size: 'md', tone: 'dark', label: 'Redes sociales', animate: true },
)

const links = socialLinks()
const root = ref<HTMLElement | null>(null)
const buttons = ref<InstanceType<typeof SocialButton>[]>([])

useGsap(root, (mm, el) => {
  if (!props.animate) return
  mm.add(MQ.motion, () => {
    const items = el.querySelectorAll('.sl-item')
    gsap.set(items, { scale: 0.4, autoAlpha: 0 })
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 95%',
      once: true,
      onEnter: () => {
        gsap.to(items, {
          scale: 1,
          autoAlpha: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: 'elastic.out(1, 0.55)',
        })
        buttons.value.forEach((b, i) => b?.draw(0.15 + i * 0.08, 1))
      },
    })
    return () => st.kill()
  })
})
</script>

<template>
  <ul v-if="links.length" ref="root" class="flex flex-wrap gap-3" :aria-label="label">
    <li v-for="l in links" :key="l.network" class="sl-item">
      <SocialButton ref="buttons" :link="l" :size="size" :tone="tone" />
    </li>
  </ul>
</template>
