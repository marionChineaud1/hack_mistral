// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/mcp-toolkit'],
  mcp: {
    name: 'URL Context',
    description: 'Retrieves rendered page context through the browser worker.',
  },
  vite: {
    server: {
      allowedHosts: true,
    },
  },
  runtimeConfig: {
    mistralApiKey: '',
    transcriptionToken: '',
    browserWorkerUrl: '',
  },
})
