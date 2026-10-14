<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { ArrowUpRight, ArrowRight, ArrowDown } from '@lucide/vue'
import { gsap, MQ } from '@/composables/useMotion'

const props = withDefaults(
  defineProps<{
    href?: string
    type?: 'button' | 'submit'
    variant?: 'accent' | 'light' | 'outline' | 'outline-dark'
    size?: 'md' | 'lg'
    icon?: 'up-right' | 'right' | 'down' | 'none'
    disabled?: boolean
    magnetic?: boolean
  }>(),
  { variant: 'accent', size: 'md', icon: 'up-right', type: 'button', magnetic: true },
)

const el = ref<HTMLElement | null>(null)
const inner = ref<HTMLElement | null>(null)
const tag = computed(() => (props.href ? 'a' : 'button'))
const Icon = computed(
  () => ({ 'up-right': ArrowUpRight, right: ArrowRight, down: ArrowDown, none: null })[props.icon],
)

let cleanup: (() => void) | undefined

onMounted(() => {
  if (!props.magnetic || !el.value) return
  const mql = window.matchMedia(`${MQ.finePointer} and ${MQ.motion}`)
  if (!mql.matches) return
  const node = el.value
  const xTo = gsap.quickTo(node, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' })
  const yTo = gsap.quickTo(node, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' })
  const ixTo = gsap.quickTo(inner.value, 'x', { duration: 0.6, ease: 'power3.out' })
  const iyTo = gsap.quickTo(inner.value, 'y', { duration: 0.6, ease: 'power3.out' })
  const move = (e: PointerEvent) => {
    const r = node.getBoundingClientRect()
    const dx = e.clientX - (r.left + r.width / 2)
    const dy = e.clientY - (r.top + r.height / 2)
    xTo(dx * 0.22)
    yTo(dy * 0.32)
    ixTo(dx * 0.1)
    iyTo(dy * 0.14)
  }
  const leave = () => {
    xTo(0)
    yTo(0)
    ixTo(0)
    iyTo(0)
  }
  node.addEventListener('pointermove', move)
  node.addEventListener('pointerleave', leave)
  cleanup = () => {
    node.removeEventListener('pointermove', move)
    node.removeEventListener('pointerleave', leave)
    gsap.killTweensOf([node, inner.value])
  }
})
onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <component
    :is="tag"
    ref="el"
    :href="href"
    :type="href ? undefined : type"
    :disabled="href ? undefined : disabled"
    :aria-disabled="disabled || undefined"
    class="mbtn"
    :class="[`mbtn--${variant}`, `mbtn--${size}`]"
  >
    <span class="mbtn-fill" aria-hidden="true" />
    <span ref="inner" class="mbtn-inner">
      <span class="mbtn-label">
        <span class="mbtn-text"><slot /></span>
        <span class="mbtn-text mbtn-text--clone" aria-hidden="true"><slot /></span>
      </span>
      <span v-if="Icon" class="mbtn-icon" aria-hidden="true">
        <component :is="Icon" :size="size === 'lg' ? 20 : 17" :stroke-width="1.75" />
      </span>
    </span>
  </component>
</template>

<style scoped>
.mbtn {
  --bg: var(--color-accent);
  --fg: var(--color-ink);
  --fill: var(--color-paper);
  --fg-hover: var(--color-ink);
  --bd: transparent;
  position: relative;
  display: inline-flex;
  align-items: center;
  isolation: isolate;
  overflow: hidden;
  border-radius: 999px;
  border: 1px solid var(--bd);
  background: var(--bg);
  color: var(--fg);
  font-weight: 600;
  letter-spacing: -0.005em;
  line-height: 1;
  text-decoration: none;
  white-space: nowrap;
  will-change: transform;
  transition:
    color 0.5s var(--ease-out-expo),
    border-color 0.5s var(--ease-out-expo);
}
.mbtn--md {
  padding: 0.95rem 1.35rem 0.95rem 1.5rem;
  font-size: 0.95rem;
}
.mbtn--lg {
  padding: 1.25rem 1.6rem 1.25rem 1.9rem;
  font-size: 1.05rem;
}
.mbtn--light {
  --bg: var(--color-paper);
  --fill: var(--color-accent);
}
.mbtn--outline {
  --bg: transparent;
  --fg: var(--color-paper);
  --fill: var(--color-paper);
  --bd: rgb(255 255 255 / 0.35);
}
.mbtn--outline-dark {
  --bg: transparent;
  --fg: var(--color-ink);
  --fill: var(--color-ink);
  --fg-hover: var(--color-paper);
  --bd: rgb(6 20 46 / 0.3);
}
.mbtn-fill {
  position: absolute;
  inset: 0;
  z-index: -1;
  background: var(--fill);
  border-radius: inherit;
  transform: translateY(101%) scale(1.15, 1);
  border-radius: 50% 50% 0 0;
  transition:
    transform 0.7s var(--ease-out-expo),
    border-radius 0.7s var(--ease-out-expo);
}
.mbtn-inner {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
}
.mbtn-label {
  position: relative;
  display: inline-block;
  overflow: hidden;
  padding-block: 0.1em;
}
.mbtn-text {
  display: block;
  transition: transform 0.6s var(--ease-out-expo);
}
.mbtn-text--clone {
  position: absolute;
  inset: 0.1em 0 auto 0;
  transform: translateY(120%);
}
.mbtn-icon {
  display: grid;
  place-items: center;
  transition: transform 0.6s var(--ease-out-expo);
}
@media (hover: hover) {
  .mbtn:hover:not([disabled]),
  .mbtn:focus-visible {
    color: var(--fg-hover);
    border-color: var(--fill);
  }
  .mbtn:hover:not([disabled]) .mbtn-fill,
  .mbtn:focus-visible .mbtn-fill {
    transform: translateY(0) scale(1.15, 1);
    border-radius: 0;
  }
  .mbtn:hover:not([disabled]) .mbtn-text,
  .mbtn:focus-visible .mbtn-text {
    transform: translateY(-120%);
  }
  .mbtn:hover:not([disabled]) .mbtn-text--clone,
  .mbtn:focus-visible .mbtn-text--clone {
    transform: translateY(0);
  }
  .mbtn:hover:not([disabled]) .mbtn-icon {
    transform: rotate(45deg);
  }
}
.mbtn[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
