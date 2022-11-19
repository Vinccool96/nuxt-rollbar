import { fileURLToPath } from "url"
import { resolve } from "path"

import { defineNuxtModule, addPlugin, createResolver,  } from "@nuxt/kit"
import { Nuxt } from "@nuxt/schema"

import consola from "consola"
import rollbar from "rollbar"

import { getRollbarEnv } from "./io"

const logger = consola.withScope("nuxt:rollbar")

function isTokenValid(token: string | null): boolean {
  return token !== null && token.length > 0
}

export interface ModuleOptions {
  clientAccessToken?: string | null
  serverAccessToken?: string | null
  config?: rollbar.Configuration
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "nuxt-rollbar",
    configKey: "nuxtRollbar",
    compatibility: {
      // Semver version of supported nuxt versions
      nuxt: "^3.0.0",
    },
  },
  defaults: {
    clientAccessToken: getRollbarEnv("server_key") || null,
    serverAccessToken: getRollbarEnv("server_key") || null,
    config: {},
  },
  setup(options: ModuleOptions, nuxt) {
    const isClientTokenValid = isTokenValid(options.clientAccessToken || null)
    const isServerTokenValid = isTokenValid(options.serverAccessToken || null)

    // if (!isClientTokenValid && !isServerTokenValid) {
    //   return
    // }

    const { resolve, resolvePath } = createResolver(import.meta.url)
    const runtimeDir = fileURLToPath(new URL("./runtime", import.meta.url))
    nuxt.options.build.transpile.push(runtimeDir)
    addPlugin(resolve(runtimeDir, "plugin"))
  },
})
