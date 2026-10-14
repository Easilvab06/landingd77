import { createApp } from 'vue'

// Fuentes autoalojadas (sin peticiones a terceros)
import '@fontsource-variable/archivo/wdth.css'
import '@fontsource-variable/inter'
import '@fontsource/instrument-serif/latin-400-italic.css'

import './styles/main.css'
import App from './App.vue'

if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

createApp(App).mount('#app')
