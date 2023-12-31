// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  build: {
    analyze: {}
  },
  typescript: {
    tsConfig: { compilerOptions: { moduleResolution: "bundler" } },
  },
  devtools: { enabled: true }
})
