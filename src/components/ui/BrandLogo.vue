<script setup lang="ts">
import { site } from '@/config/site'

withDefaults(defineProps<{ tone?: 'light' | 'dark'; compact?: boolean }>(), {
  tone: 'light',
  compact: false,
})
</script>

<template>
  <!-- Si hay logo oficial configurado en src/config/site.ts se usa ese archivo -->
  <img
    v-if="tone === 'light' ? site.logoSrcLight || site.logoSrc : site.logoSrc"
    :src="tone === 'light' ? site.logoSrcLight || site.logoSrc : site.logoSrc"
    :alt="site.name"
    class="h-9 w-auto"
    width="160"
    height="36"
  />
  <!-- Logotipo tipográfico provisional -->
  <span
    v-else
    class="brand"
    :class="tone === 'light' ? 'text-paper' : 'text-ink'"
    role="img"
    :aria-label="site.name"
  >
    <svg class="brand-mark" viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="19" fill="none" stroke="currentColor" stroke-opacity=".28" />
      <path d="M1 20h38" stroke="currentColor" stroke-opacity=".28" />
      <path d="M20 20m-8 0a8 8 0 0 1 16 0" fill="var(--color-accent)" />
      <g stroke="var(--color-accent)" stroke-width="1.6" stroke-linecap="round">
        <path d="M20 4.5v4M8.6 9.2l2.8 2.8M31.4 9.2l-2.8 2.8M4.5 20h3.5M32 20h3.5" />
      </g>
    </svg>
    <span v-if="!compact" class="brand-word">{{ site.name }}</span>
  </span>
</template>

<style scoped>
.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
}
.brand-mark {
  width: 2.1rem;
  height: 2.1rem;
  transition: transform 1s var(--ease-out-expo);
}
.brand:hover .brand-mark {
  transform: rotate(-90deg);
}
.brand-word {
  font-family: var(--font-display);
  font-variation-settings: 'wdth' 118;
  font-weight: 600;
  font-size: 1.3rem;
  letter-spacing: -0.04em;
  line-height: 1;
}
</style>
