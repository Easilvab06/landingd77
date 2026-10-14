<script setup lang="ts">
import { ref } from 'vue'
import ResponsiveImage from '@/components/ui/ResponsiveImage.vue'
import MagneticButton from '@/components/ui/MagneticButton.vue'
import { images } from '@/data/images'
import { gsap, MQ, revealLines, useGsap } from '@/composables/useMotion'

const root = ref<HTMLElement | null>(null)

useGsap(root, (mm, el) => {
  const q = gsap.utils.selector(el)
  mm.add(MQ.motion, () => {
    // La ventana se abre hasta ocupar toda la pantalla
    gsap
      .timeline({ scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 10%', scrub: 0.8 } })
      .fromTo(
        q('.cta-frame')[0]!,
        { clipPath: 'inset(14% 10% 14% 10% round 28px)' },
        { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none' },
      )
      .fromTo(q('.cta-img')[0]!, { scale: 1.3 }, { scale: 1, ease: 'none' }, 0)
    const s = revealLines(q('[data-lines]')[0]!, { start: 'top 70%' })
    gsap.from(q('[data-fade]'), {
      y: 30,
      autoAlpha: 0,
      stagger: 0.1,
      scrollTrigger: { trigger: q('[data-lines]')[0], start: 'top 65%', once: true },
    })
    return () => s.revert()
  })
})
</script>

<template>
  <section ref="root" class="relative bg-paper" aria-labelledby="cta-title">
    <div class="cta-frame relative isolate flex min-h-[100svh] items-center overflow-hidden bg-ink">
      <div class="cta-img absolute inset-0 -z-10">
        <ResponsiveImage :image="images.andeanPlant" sizes="100vw" alt="" />
      </div>
      <div
        class="absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_50%_50%,rgb(16_21_34/0.55),rgb(16_21_34/0.88))]"
      />
      <div class="grain absolute inset-0 -z-10" />

      <div class="container-x py-32 text-center text-paper">
        <p data-fade class="mono text-accent">Siguiente paso</p>
        <h2 id="cta-title" data-lines class="display-xl mx-auto mt-8 max-w-[13ch] text-balance">
          Hagamos que la energía trabaje a tu
          <em class="serif-accent text-accent-soft">favor.</em>
        </h2>
        <p data-fade class="lead mx-auto mt-8 max-w-xl text-paper/80">
          Cuéntanos qué necesitas y exploremos una solución energética diseñada para tu proyecto.
        </p>
        <div data-fade class="mt-12 flex justify-center">
          <MagneticButton href="#contacto" size="lg">Hablar con un asesor</MagneticButton>
        </div>
      </div>
    </div>
  </section>
</template>
