<script setup lang="ts">
/**
 * Instrumento solar en vivo: posición real del sol sobre la ubicación configurada.
 * Datos calculados astronómicamente en el navegador (sin APIs ni cifras inventadas).
 */
import { computed } from 'vue'
import { site } from '@/config/site'
import { formatTime, useSunPosition } from '@/composables/useSunPosition'

const { lat, lon, label } = site.sunLocation
const { now, position, day, progress, isDay } = useSunPosition(lat, lon)

// Arco: semicírculo de 0 (amanecer, izquierda) a 1 (atardecer, derecha)
const W = 240
const H = 110
const R = 100
const cx = W / 2
const cy = H - 4

const sun = computed(() => {
  const p = Math.min(1, Math.max(0, progress.value))
  const a = Math.PI * (1 - p)
  return { x: cx + R * Math.cos(a), y: cy - R * Math.sin(a) }
})
const arcLen = Math.PI * R
const dash = computed(() => arcLen * Math.min(1, Math.max(0, progress.value)))

const dms = (v: number, pos: string, neg: string) => {
  const a = Math.abs(v)
  const d = Math.floor(a)
  const m = Math.round((a - d) * 60)
  return `${String(d).padStart(2, '0')}°${String(m).padStart(2, '0')}′ ${v >= 0 ? pos : neg}`
}
const coords = `${dms(lat, 'N', 'S')} · ${dms(lon, 'E', 'O')}`
const clock = computed(() => formatTime(now.value.getTime()))
const elev = computed(() => position.value.elevation.toFixed(1))
const az = computed(() => position.value.azimuth.toFixed(0))
const summary = computed(() =>
  isDay.value
    ? `En ${label}, a las ${clock.value}, el sol está a ${elev.value} grados sobre el horizonte.`
    : `En ${label} es de noche (${clock.value}). Próximo amanecer cerca de las ${formatTime(day.value.sunrise)}.`,
)
</script>

<template>
  <figure class="tracker" :aria-label="`Posición solar en tiempo real — ${label}`">
    <div class="flex items-center justify-between gap-4">
      <span class="mono flex items-center gap-2 text-paper/80">
        <span class="live-dot" :class="{ 'is-night': !isDay }" aria-hidden="true" />
        Sol en vivo
      </span>
      <span class="mono text-mute">{{ clock }} COT</span>
    </div>

    <svg :viewBox="`0 0 ${W} ${H + 6}`" class="mt-4 w-full" aria-hidden="true">
      <defs>
        <linearGradient id="arcGrad" x1="0" x2="1">
          <stop offset="0" stop-color="#5B9BFF" stop-opacity=".2" />
          <stop offset="1" stop-color="#5B9BFF" />
        </linearGradient>
        <radialGradient id="sunGlow">
          <stop offset="0" stop-color="#B9D3FF" stop-opacity=".9" />
          <stop offset="1" stop-color="#5B9BFF" stop-opacity="0" />
        </radialGradient>
      </defs>
      <line :x1="0" :x2="W" :y1="cy" :y2="cy" stroke="rgba(255,255,255,.25)" />
      <g stroke="rgba(255,255,255,.25)">
        <line
          v-for="i in 13"
          :key="i"
          :x1="(W / 12) * (i - 1)"
          :x2="(W / 12) * (i - 1)"
          :y1="cy"
          :y2="cy + 5"
        />
      </g>
      <path
        :d="`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`"
        fill="none"
        stroke="rgba(255,255,255,.18)"
        stroke-dasharray="2 4"
      />
      <path
        :d="`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`"
        fill="none"
        stroke="url(#arcGrad)"
        stroke-width="1.5"
        :stroke-dasharray="`${dash} ${arcLen}`"
      />
      <g v-if="isDay" :transform="`translate(${sun.x} ${sun.y})`">
        <circle r="16" fill="url(#sunGlow)" class="pulse" />
        <circle r="4.5" fill="#5B9BFF" />
      </g>
    </svg>

    <dl class="mt-3 grid grid-cols-3 gap-3 border-t border-white/10 pt-3">
      <div>
        <dt class="mono text-mute">Elevación</dt>
        <dd class="tabular-nums text-paper">{{ elev }}°</dd>
      </div>
      <div>
        <dt class="mono text-mute">Amanecer</dt>
        <dd class="tabular-nums text-paper">{{ formatTime(day.sunrise) }}</dd>
      </div>
      <div>
        <dt class="mono text-mute">Atardecer</dt>
        <dd class="tabular-nums text-paper">{{ formatTime(day.sunset) }}</dd>
      </div>
    </dl>
    <figcaption class="mono mt-3 text-[0.62rem] text-mute">
      {{ label }} · {{ coords }} · Az {{ az }}°
      <span class="sr-only">{{ summary }}</span>
    </figcaption>
  </figure>
</template>

<style scoped>
.tracker {
  width: 100%;
  max-width: 19rem;
  padding: 1.1rem 1.2rem 1rem;
  background: linear-gradient(160deg, rgb(15 58 138 / 0.55), rgb(6 20 46 / 0.55));
  border: 1px solid rgb(255 255 255 / 0.14);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
.live-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--color-accent);
  box-shadow: 0 0 0 0 rgb(91 155 255 / 0.6);
  animation: ping 2.2s infinite;
}
.live-dot.is-night {
  background: var(--color-mute);
  animation: none;
}
.pulse {
  transform-origin: center;
  animation: glow 3s ease-in-out infinite;
}
@keyframes ping {
  70% {
    box-shadow: 0 0 0 9px rgb(91 155 255 / 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgb(91 155 255 / 0);
  }
}
@keyframes glow {
  50% {
    transform: scale(1.35);
    opacity: 0.6;
  }
}
dd {
  font-family: var(--font-display);
  font-variation-settings: 'wdth' 110;
  font-size: 1.05rem;
  font-weight: 500;
  margin-top: 0.15rem;
}
</style>
