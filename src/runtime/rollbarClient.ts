import { defineNuxtPlugin, useRuntimeConfig } from "#app"

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  console.log(JSON.stringify(config))
})
