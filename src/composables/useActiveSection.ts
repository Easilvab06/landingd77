import { onBeforeUnmount, onMounted, ref } from 'vue'

/** Devuelve el id de la sección visible en el centro de la pantalla. */
export function useActiveSection(ids: readonly string[]) {
  const active = ref<string>(ids[0] ?? '')
  let io: IntersectionObserver | undefined

  onMounted(() => {
    io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) active.value = entry.target.id
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io!.observe(el)
    })
  })
  onBeforeUnmount(() => io?.disconnect())
  return active
}
