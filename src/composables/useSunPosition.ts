import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * Posición solar en tiempo real calculada con el algoritmo astronómico
 * simplificado (precisión ~0,5°). No usa servicios externos ni datos inventados.
 * Colombia no tiene horario de verano: zona fija UTC−5.
 */
const RAD = Math.PI / 180
const DEG = 180 / Math.PI
const TZ_OFFSET_H = -5

function wrap360(x: number) {
  return ((x % 360) + 360) % 360
}

export function solarPosition(date: Date, lat: number, lon: number) {
  const d = date.getTime() / 86_400_000 - 10_957.5 // días desde J2000.0
  const g = wrap360(357.529 + 0.98560028 * d) * RAD
  const q = wrap360(280.459 + 0.98564736 * d)
  const L = (q + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * RAD
  const e = (23.439 - 0.00000036 * d) * RAD
  const ra = Math.atan2(Math.cos(e) * Math.sin(L), Math.cos(L)) * DEG
  const dec = Math.asin(Math.sin(e) * Math.sin(L))
  const gmst = wrap360((18.697374558 + 24.06570982441908 * d) * 15)
  const H = wrap360(gmst + lon - ra) * RAD
  const phi = lat * RAD
  const elevation =
    Math.asin(Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(H)) * DEG
  const azimuth = wrap360(
    Math.atan2(-Math.sin(H), Math.tan(dec) * Math.cos(phi) - Math.sin(phi) * Math.cos(H)) * DEG,
  )
  return { elevation, azimuth }
}

function localMidnightUTC(now: Date) {
  const local = new Date(now.getTime() + TZ_OFFSET_H * 3_600_000)
  return (
    Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate()) -
    TZ_OFFSET_H * 3_600_000
  )
}

/** Busca amanecer, mediodía solar y atardecer del día local (paso de 1 minuto). */
export function solarDay(now: Date, lat: number, lon: number) {
  const start = localMidnightUTC(now)
  const horizon = -0.833
  let sunrise: number | null = null
  let sunset: number | null = null
  let noon = start
  let maxEl = -90
  let prev = solarPosition(new Date(start), lat, lon).elevation
  for (let m = 1; m <= 1440; m++) {
    const t = start + m * 60_000
    const el = solarPosition(new Date(t), lat, lon).elevation
    if (prev < horizon && el >= horizon && sunrise === null) sunrise = t
    if (prev >= horizon && el < horizon) sunset = t
    if (el > maxEl) {
      maxEl = el
      noon = t
    }
    prev = el
  }
  return { sunrise, sunset, noon, maxElevation: maxEl }
}

const timeFmt = new Intl.DateTimeFormat('es-CO', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'America/Bogota',
})

export function formatTime(ms: number | null) {
  return ms === null ? '—' : timeFmt.format(ms)
}

export function useSunPosition(lat: number, lon: number) {
  const now = ref(new Date())
  let timer: number | undefined
  let dayKey = ''
  const day = ref(solarDay(now.value, lat, lon))

  const update = () => {
    now.value = new Date()
    const key = new Date(now.value.getTime() + TZ_OFFSET_H * 3_600_000).toISOString().slice(0, 10)
    if (key !== dayKey) {
      dayKey = key
      day.value = solarDay(now.value, lat, lon)
    }
  }

  onMounted(() => {
    update()
    timer = window.setInterval(update, 30_000)
  })
  onBeforeUnmount(() => window.clearInterval(timer))

  const position = computed(() => solarPosition(now.value, lat, lon))
  /** 0 = amanecer, 1 = atardecer; <0 o >1 = noche. */
  const progress = computed(() => {
    const { sunrise, sunset } = day.value
    if (sunrise === null || sunset === null) return 0.5
    return (now.value.getTime() - sunrise) / (sunset - sunrise)
  })
  const isDay = computed(() => position.value.elevation > -0.833)

  return { now, position, day, progress, isDay }
}
