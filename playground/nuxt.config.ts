import { defineNuxtConfig } from "nuxt/config"
import NuxtRollbar from ".."

export default defineNuxtConfig({
  modules: [NuxtRollbar],
  nuxtRollbar: {
    config: {},
  },
})
