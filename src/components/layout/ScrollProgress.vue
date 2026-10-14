<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const bar = ref<HTMLElement | null>(null)
let raf = 0
const update = () => {
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    const p = max > 0 ? window.scrollY / max : 0
    if (bar.value) bar.value.style.transform = `scaleX(${p})`
  })
}
onMounted(() => {
  update()
  window.addEventListener('scroll', update, { passive: true })
  window.addEventListener('resize', update)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', update)
  window.removeEventListener('resize', update)
  cancelAnimationFrame(raf)
})
</script>

<template>
  <div class="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px]" aria-hidden="true">
    <div ref="bar" class="h-full origin-left bg-accent" style="transform: scaleX(0)" />
  </div>
</template>
