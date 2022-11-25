import { defineNuxtConfig } from "nuxt/config"
import NuxtRollbar from ".."

console.log(JSON.stringify(process.env, null, 2))

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
