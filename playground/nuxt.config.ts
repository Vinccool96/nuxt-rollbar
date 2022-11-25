import { defineNuxtConfig } from "nuxt/config"
import NuxtRollbar from ".."

export default defineNuxtConfig({
  modules: [NuxtRollbar],
  nuxtRollbar: {
    config: {},
  },

  runtimeConfig: {
    rollbarServerKey: "",
    rollbarClientKey: "",
    public: {
      rollbarServerKey: "",
      rollbarClientKey: "",
    },
  },
})
