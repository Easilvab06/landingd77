<script setup lang="ts">
/**
 * CONTACTO
 * - Envía por POST (JSON) a VITE_FORM_ENDPOINT (Formspree, Getform, API propia…).
 * - Sin endpoint configurado NO simula un envío exitoso: lo informa con claridad.
 * - Los canales (WhatsApp, teléfono, correo) solo aparecen si están en src/config/site.ts.
 */
import { computed, reactive, ref, watch } from 'vue'
import {
  ArrowUpRight,
  Check,
  CircleAlert,
  LoaderCircle,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
} from '@lucide/vue'
import SectionLabel from '@/components/ui/SectionLabel.vue'
import SocialLinks from '@/components/ui/SocialLinks.vue'
import MagneticButton from '@/components/ui/MagneticButton.vue'
import { site, whatsappHref } from '@/config/site'
import { solutions } from '@/data/solutions'
import { selectedSolution } from '@/composables/useInquiry'
import { gsap, MQ, revealLines, useGsap } from '@/composables/useMotion'

type Field = 'name' | 'company' | 'email' | 'phone' | 'solution' | 'message' | 'consent'

const form = reactive({
  name: '',
  company: '',
  email: '',
  phone: '',
  solution: '',
  message: '',
  consent: false,
  website: '', // honeypot anti-spam
})
const touched = reactive<Record<Field, boolean>>({
  name: false,
  company: false,
  email: false,
  phone: false,
  solution: false,
  message: false,
  consent: false,
})
const status = ref<'idle' | 'sending' | 'success' | 'error' | 'offline'>('idle')
const wa = whatsappHref()
const channelIcons = { whatsapp: MessageCircle, phone: Phone, email: Mail, address: MapPin }
const solutionOptions = [
  ...solutions.map((s) => ({ id: s.id, label: s.title })),
  { id: 'otra', label: 'Otra / no estoy seguro' },
]

watch(selectedSolution, (id) => {
  if (id) form.solution = id
})

const errors = computed<Partial<Record<Field, string>>>(() => {
  const e: Partial<Record<Field, string>> = {}
  if (form.name.trim().length < 2) e.name = 'Escribe tu nombre completo.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()))
    e.email = 'Escribe un correo válido, por ejemplo nombre@empresa.com.'
  const digits = form.phone.replace(/\D/g, '')
  if (digits.length < 7 || digits.length > 15)
    e.phone = 'Escribe un número de teléfono válido (7 a 15 dígitos).'
  if (!form.solution) e.solution = 'Selecciona el tipo de solución que te interesa.'
  if (form.message.trim().length < 15)
    e.message = 'Cuéntanos un poco más sobre tu proyecto (mínimo 15 caracteres).'
  if (!form.consent)
    e.consent = 'Debes autorizar el tratamiento de tus datos para poder contactarte.'
  return e
})
const show = (f: Field) => (touched[f] ? errors.value[f] : undefined)

const formEl = ref<HTMLFormElement | null>(null)

async function submit() {
  ;(Object.keys(touched) as Field[]).forEach((k) => (touched[k] = true))
  const first = (Object.keys(errors.value) as Field[])[0]
  if (first) {
    formEl.value?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus()
    return
  }
  if (form.website) return // bot
  if (!site.formEndpoint) {
    status.value = 'offline'
    return
  }
  status.value = 'sending'
  try {
    const res = await fetch(site.formEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        nombre: form.name.trim(),
        empresa: form.company.trim(),
        correo: form.email.trim(),
        telefono: form.phone.trim(),
        solucion: solutionOptions.find((o) => o.id === form.solution)?.label ?? form.solution,
        mensaje: form.message.trim(),
        consentimiento_datos: form.consent,
        origen: `Sitio web ${site.name}`,
      }),
    })
    if (!res.ok) throw new Error(String(res.status))
    status.value = 'success'
  } catch {
    status.value = 'error'
  }
}

function reset() {
  Object.assign(form, {
    name: '',
    company: '',
    email: '',
    phone: '',
    solution: '',
    message: '',
    consent: false,
  })
  ;(Object.keys(touched) as Field[]).forEach((k) => (touched[k] = false))
  status.value = 'idle'
}

const root = ref<HTMLElement | null>(null)
useGsap(root, (mm, el) => {
  const q = gsap.utils.selector(el)
  mm.add(MQ.motion, () => {
    const s = revealLines(q('[data-lines]')[0]!)
    gsap.from(q('.f-row'), {
      y: 40,
      autoAlpha: 0,
      stagger: 0.06,
      scrollTrigger: { trigger: formEl.value, start: 'top 85%', once: true },
    })
    return () => s.revert()
  })
})
</script>

<template>
  <section
    id="contacto"
    ref="root"
    class="relative overflow-hidden bg-blue py-[var(--section-y)] text-paper"
    aria-labelledby="contact-title"
  >
    <div class="contact-glow pointer-events-none absolute inset-0" aria-hidden="true" />
    <div class="container-x relative grid gap-16 lg:grid-cols-12 lg:gap-8">
      <!-- Columna de texto -->
      <div class="lg:col-span-5">
        <SectionLabel index="06" label="Contacto" />
        <h2 id="contact-title" data-lines class="display-lg mt-8 text-balance">
          Cuéntanos sobre tu <em class="serif-accent text-accent">proyecto.</em>
        </h2>
        <p class="lead mt-8 max-w-md text-paper/75">
          Completa el formulario con los datos básicos y un asesor revisará tu solicitud para
          orientarte sobre la mejor alternativa.
        </p>

        <div class="mt-10">
          <p class="mono text-mute">También estamos en</p>
          <SocialLinks class="mt-5" size="lg" label="Redes sociales de la empresa" />
        </div>

        <div v-if="wa || site.channels.length" class="mt-12 space-y-4">
          <MagneticButton
            v-if="wa"
            :href="wa"
            target="_blank"
            rel="noopener"
            size="lg"
            icon="up-right"
          >
            Escríbenos por WhatsApp
          </MagneticButton>
          <ul v-if="site.channels.length" class="mt-8 border-t border-white/15">
            <li v-for="c in site.channels" :key="c.value" class="border-b border-white/15">
              <component
                :is="c.type === 'address' ? 'p' : 'a'"
                :href="
                  c.type === 'email'
                    ? `mailto:${c.value}`
                    : c.type === 'phone'
                      ? `tel:${c.value.replace(/\s/g, '')}`
                      : c.type === 'whatsapp'
                        ? wa
                        : undefined
                "
                class="flex items-center gap-4 py-5"
              >
                <component
                  :is="channelIcons[c.type]"
                  :size="20"
                  :stroke-width="1.5"
                  class="text-accent"
                />
                <span class="mono w-24 text-mute">{{ c.label }}</span>
                <span class="text-paper">{{ c.value }}</span>
              </component>
            </li>
          </ul>
        </div>
      </div>

      <!-- Formulario -->
      <div class="lg:col-span-6 lg:col-start-7">
        <div v-if="status === 'success'" class="f-done" role="status" aria-live="polite">
          <span class="f-done-icon"><Check :size="28" /></span>
          <h3 class="display-md mt-8">Solicitud enviada.</h3>
          <p class="mt-4 max-w-md text-paper/75">
            Gracias, {{ form.name.split(' ')[0] }}. Recibimos tu información y un asesor se
            comunicará contigo.
          </p>
          <button
            type="button"
            class="mt-8 text-accent underline-offset-4 hover:underline"
            @click="reset"
          >
            Enviar otra solicitud
          </button>
        </div>

        <form v-else ref="formEl" class="space-y-7" novalidate @submit.prevent="submit">
          <div class="f-row grid gap-7 sm:grid-cols-2">
            <div class="field">
              <label for="f-name"
                >Nombre <span aria-hidden="true" class="text-accent">*</span></label
              >
              <input
                id="f-name"
                v-model="form.name"
                data-field="name"
                type="text"
                autocomplete="name"
                required
                :aria-invalid="!!show('name')"
                :aria-describedby="show('name') ? 'e-name' : undefined"
                @blur="touched.name = true"
              />
              <p v-if="show('name')" id="e-name" class="err">
                <CircleAlert :size="14" />{{ show('name') }}
              </p>
            </div>
            <div class="field">
              <label for="f-company">Empresa <span class="text-mute">(opcional)</span></label>
              <input
                id="f-company"
                v-model="form.company"
                type="text"
                autocomplete="organization"
              />
            </div>
          </div>

          <div class="f-row grid gap-7 sm:grid-cols-2">
            <div class="field">
              <label for="f-email"
                >Correo electrónico <span aria-hidden="true" class="text-accent">*</span></label
              >
              <input
                id="f-email"
                v-model="form.email"
                data-field="email"
                type="email"
                autocomplete="email"
                inputmode="email"
                required
                :aria-invalid="!!show('email')"
                :aria-describedby="show('email') ? 'e-email' : undefined"
                @blur="touched.email = true"
              />
              <p v-if="show('email')" id="e-email" class="err">
                <CircleAlert :size="14" />{{ show('email') }}
              </p>
            </div>
            <div class="field">
              <label for="f-phone"
                >Teléfono <span aria-hidden="true" class="text-accent">*</span></label
              >
              <input
                id="f-phone"
                v-model="form.phone"
                data-field="phone"
                type="tel"
                autocomplete="tel"
                inputmode="tel"
                required
                :aria-invalid="!!show('phone')"
                :aria-describedby="show('phone') ? 'e-phone' : undefined"
                @blur="touched.phone = true"
              />
              <p v-if="show('phone')" id="e-phone" class="err">
                <CircleAlert :size="14" />{{ show('phone') }}
              </p>
            </div>
          </div>

          <fieldset class="f-row" :aria-describedby="show('solution') ? 'e-solution' : undefined">
            <legend class="f-legend">
              Tipo de solución de interés <span aria-hidden="true" class="text-accent">*</span>
            </legend>
            <div class="mt-4 flex flex-wrap gap-2">
              <label v-for="(o, i) in solutionOptions" :key="o.id" class="chip">
                <input
                  v-model="form.solution"
                  type="radio"
                  name="solution"
                  :value="o.id"
                  :data-field="i === 0 ? 'solution' : undefined"
                  class="sr-only"
                  @change="touched.solution = true"
                />
                <span>{{ o.label }}</span>
              </label>
            </div>
            <p v-if="show('solution')" id="e-solution" class="err">
              <CircleAlert :size="14" />{{ show('solution') }}
            </p>
          </fieldset>

          <div class="f-row field">
            <label for="f-message"
              >Descripción del proyecto <span aria-hidden="true" class="text-accent">*</span></label
            >
            <textarea
              id="f-message"
              v-model="form.message"
              data-field="message"
              rows="4"
              required
              placeholder="Ubicación, tipo de operación, consumo aproximado o lo que quieras contarnos."
              :aria-invalid="!!show('message')"
              :aria-describedby="show('message') ? 'e-message' : undefined"
              @blur="touched.message = true"
            />
            <p v-if="show('message')" id="e-message" class="err">
              <CircleAlert :size="14" />{{ show('message') }}
            </p>
          </div>

          <!-- Honeypot: invisible para personas -->
          <div class="hidden" aria-hidden="true">
            <label
              >No llenar <input v-model="form.website" type="text" tabindex="-1" autocomplete="off"
            /></label>
          </div>

          <div class="f-row">
            <label class="consent">
              <input
                v-model="form.consent"
                data-field="consent"
                type="checkbox"
                :aria-invalid="!!show('consent')"
                :aria-describedby="show('consent') ? 'e-consent' : undefined"
                @change="touched.consent = true"
              />
              <span class="box" aria-hidden="true"><Check :size="14" :stroke-width="3" /></span>
              <span class="text-[0.92rem] text-paper/75">
                Autorizo a {{ site.name }} el tratamiento de mis datos personales para atender esta
                solicitud, conforme a la Ley 1581 de 2012<template v-if="site.privacyPolicyUrl">
                  y a su
                  <a
                    :href="site.privacyPolicyUrl"
                    target="_blank"
                    rel="noopener"
                    class="text-accent underline underline-offset-4"
                    >política de tratamiento de datos</a
                  ></template
                >.
              </span>
            </label>
            <p v-if="show('consent')" id="e-consent" class="err">
              <CircleAlert :size="14" />{{ show('consent') }}
            </p>
          </div>

          <div class="f-row flex flex-wrap items-center gap-6 pt-2">
            <MagneticButton
              type="submit"
              size="lg"
              :disabled="status === 'sending'"
              :icon="status === 'sending' ? 'none' : 'up-right'"
            >
              <span class="inline-flex items-center gap-2">
                <LoaderCircle v-if="status === 'sending'" :size="18" class="animate-spin" />
                {{ status === 'sending' ? 'Enviando…' : 'Enviar solicitud' }}
              </span>
            </MagneticButton>
            <p class="text-sm text-mute"><span class="text-accent">*</span> Campos obligatorios</p>
          </div>

          <div aria-live="polite">
            <p v-if="status === 'error'" class="notice notice--error">
              <CircleAlert :size="18" class="shrink-0" />
              No pudimos enviar tu solicitud. Revisa tu conexión e inténtalo de nuevo<template
                v-if="wa"
                >, o
                <a :href="wa" target="_blank" rel="noopener" class="underline"
                  >escríbenos por WhatsApp</a
                ></template
              >.
            </p>
            <p v-if="status === 'offline'" class="notice">
              <CircleAlert :size="18" class="shrink-0" />
              <span>
                El envío en línea aún no está habilitado, por lo que tu solicitud
                <strong>no se ha enviado</strong>.
                <template v-if="wa">
                  Puedes contactarnos ahora por
                  <a
                    :href="wa"
                    target="_blank"
                    rel="noopener"
                    class="inline-flex items-center gap-1 text-accent underline"
                    >WhatsApp <ArrowUpRight :size="14" /></a
                  >.
                </template>
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact-glow {
  background:
    radial-gradient(45% 50% at 0% 100%, rgb(91 155 255 / 0.12), transparent 70%),
    radial-gradient(50% 50% at 100% 0%, rgb(6 20 46 / 0.6), transparent 70%);
}
.field label,
.f-legend {
  display: block;
  font-size: 0.85rem;
  font-weight: 500;
  color: rgb(255 255 255 / 0.85);
}
.field input,
.field textarea {
  width: 100%;
  margin-top: 0.4rem;
  padding: 0.8rem 0;
  background: transparent;
  border: 0;
  border-bottom: 1px solid rgb(255 255 255 / 0.3);
  border-radius: 0;
  color: var(--color-paper);
  font-size: 1.1rem;
  transition: border-color 0.4s;
  resize: vertical;
}
.field textarea::placeholder {
  color: rgb(255 255 255 / 0.4);
  font-size: 0.95rem;
}
.field input:focus-visible,
.field textarea:focus-visible {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 1px 0 0 var(--color-accent);
}
.field input[aria-invalid='true'],
.field textarea[aria-invalid='true'] {
  border-color: #ff9c8a;
}
.err {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: #ffb4a6;
}
.chip span {
  display: inline-block;
  padding: 0.65rem 1.05rem;
  border-radius: 999px;
  border: 1px solid rgb(255 255 255 / 0.25);
  font-size: 0.9rem;
  color: rgb(255 255 255 / 0.8);
  cursor: pointer;
  transition:
    background 0.35s,
    color 0.35s,
    border-color 0.35s;
}
.chip:hover span {
  border-color: rgb(255 255 255 / 0.6);
}
.chip input:checked + span {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: var(--color-ink);
  font-weight: 600;
}
.chip input:focus-visible + span {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
}
.consent {
  position: relative;
  display: grid;
  grid-template-columns: 1.4rem 1fr;
  gap: 0.9rem;
  align-items: start;
  cursor: pointer;
}
.consent input {
  position: absolute;
  opacity: 0;
  width: 1.4rem;
  height: 1.4rem;
}
.box {
  display: grid;
  place-items: center;
  width: 1.4rem;
  height: 1.4rem;
  margin-top: 0.1rem;
  border: 1px solid rgb(255 255 255 / 0.4);
  color: transparent;
  transition:
    background 0.3s,
    color 0.3s,
    border-color 0.3s;
}
.consent input:checked + .box {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: var(--color-ink);
}
.consent input:focus-visible + .box {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
}
.notice {
  display: flex;
  gap: 0.75rem;
  padding: 1rem 1.1rem;
  border: 1px solid rgb(91 155 255 / 0.4);
  background: rgb(91 155 255 / 0.08);
  font-size: 0.95rem;
  color: rgb(255 255 255 / 0.9);
}
.notice--error {
  border-color: rgb(255 156 138 / 0.5);
  background: rgb(255 156 138 / 0.08);
}
.f-done {
  padding: 3rem 0;
}
.f-done-icon {
  display: grid;
  place-items: center;
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 50%;
  background: var(--color-accent);
  color: var(--color-ink);
}
</style>
