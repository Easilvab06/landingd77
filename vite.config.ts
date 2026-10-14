import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/landingd77/',

  plugins: [vue(), tailwindcss()],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          gsap: [
            'gsap',
            'gsap/ScrollTrigger',
            'gsap/SplitText',
            'gsap/MotionPathPlugin',
          ],
          vendor: ['vue', 'lenis'],
        },
      },
    },
  },
})