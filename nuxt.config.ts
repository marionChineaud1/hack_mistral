// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
      meta: [{ name: 'theme-color', content: '#271f58' }],
    },
  },
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/mcp-toolkit',
    '@nuxtjs/tailwindcss',
    '@nuxthub/core',
    '@nuxt/icon',
    '@nuxt/fonts',
  ],
  hub: {
    db: 'sqlite',
  },
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
    public: {
      siteUrl: '',
    },
  },
})
