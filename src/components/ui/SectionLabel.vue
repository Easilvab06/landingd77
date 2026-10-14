<script setup lang="ts">
defineProps<{ index: string; label: string; tone?: 'light' | 'dark' }>()
</script>

<template>
  <p
    class="eyebrow flex items-center gap-4"
    :class="tone === 'dark' ? 'text-mute-strong' : 'text-mute'"
  >
    <span class="mono text-accent" :class="tone === 'dark' ? 'label-dark' : ''">{{ index }}</span>
    <span aria-hidden="true" class="h-px w-10 bg-current opacity-40" />
    <span>{{ label }}</span>
  </p>
</template>

<style scoped>
/* El azul claro sobre blanco no alcanza AA: en fondos claros usamos azul intenso */
.label-dark {
  color: var(--color-blue);
}
</style>
