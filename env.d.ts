/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Endpoint que recibe el formulario (Formspree, Getform, API propia…). */
  readonly VITE_FORM_ENDPOINT?: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
