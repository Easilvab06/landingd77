<script setup lang="ts">
import { computed } from 'vue'
import type { ImageAsset } from '@/types'

const props = withDefaults(
  defineProps<{
    image: ImageAsset
    sizes?: string
    priority?: boolean
    /** Muestra la etiqueta "Imagen referencial" cuando corresponde. */
    showTag?: boolean
    tagPosition?: 'tl' | 'br' | 'bl'
    imgClass?: string
    alt?: string
  }>(),
  { sizes: '100vw', priority: false, showTag: false, tagPosition: 'bl', imgClass: '' },
)

/** URL de una variante: local (public/images, respeta el `base` de Vite) o remota (CDN de Unsplash con recorte al vuelo). */
const url = (w: number, ext: string) => {
  const { remote, width, height, name } = props.image
  if (remote) {
    const h = Math.round((w * height) / width)
    const fm = ext === 'jpg' ? 'jpg' : ext
    return `${remote}?w=${w}&h=${h}&fit=crop&crop=entropy&fm=${fm}&q=70`
  }
  return `${import.meta.env.BASE_URL}images/${name}-${w}.${ext}`
}

const srcset = (ext: string) => props.image.widths.map((w) => `${url(w, ext)} ${w}w`).join(', ')

const fallback = computed(() => {
  const w =
    props.image.widths.find((x) => x >= 1200) ?? props.image.widths[props.image.widths.length - 1]
  return url(w ?? 1200, 'jpg')
})

const style = computed(() => ({
  '--focus': props.image.focus ?? '50% 50%',
  '--focus-m': props.image.focusMobile ?? props.image.focus ?? '50% 50%',
  backgroundColor: props.image.color,
}))
</script>

<template>
  <picture class="ri" :style="style">
    <source type="image/avif" :srcset="srcset('avif')" :sizes="sizes" />
    <source type="image/webp" :srcset="srcset('webp')" :sizes="sizes" />
    <img
      :src="fallback"
      :srcset="srcset('jpg')"
      :sizes="sizes"
      :width="image.width"
      :height="image.height"
      :alt="alt ?? image.alt"
      :loading="priority ? 'eager' : 'lazy'"
      :fetchpriority="priority ? 'high' : 'auto'"
      decoding="async"
      :class="['ri-img', imgClass]"
    />
    <span
      v-if="showTag && (image.referential || image.credit)"
      class="ri-tag mono"
      :class="`ri-tag--${tagPosition}`"
    >
      {{
        image.credit
          ? `Foto: ${image.credit.author} / ${image.credit.source}`
          : 'Imagen referencial'
      }}
    </span>
  </picture>
</template>

<style scoped>
.ri {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.ri-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: var(--focus-m);
  display: block;
}
@media (min-width: 768px) {
  .ri-img {
    object-position: var(--focus);
  }
}
.ri-tag {
  position: absolute;
  z-index: 2;
  padding: 0.35rem 0.55rem;
  font-size: 0.6rem;
  color: rgb(255 255 255 / 0.85);
  background: rgb(6 20 46 / 0.55);
  backdrop-filter: blur(6px);
  border: 1px solid rgb(255 255 255 / 0.14);
  pointer-events: none;
}
.ri-tag--tl {
  top: 0.75rem;
  left: 0.75rem;
}
.ri-tag--bl {
  bottom: 0.75rem;
  left: 0.75rem;
}
.ri-tag--br {
  bottom: 0.75rem;
  right: 0.75rem;
}
</style>
