import { defineNuxtPlugin, useRuntimeConfig } from "#app"
import { loadNuxtConfig } from "@nuxt/kit"

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  console.log(JSON.stringify(config))
})
