import { defineNuxtConfig } from "nuxt/config"

export default defineNuxtConfig({
  imports: {
    autoImport: false,
  },
  typescript: {
    includeWorkspace: true,
  },
})
