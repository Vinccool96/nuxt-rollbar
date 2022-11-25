import { fileURLToPath } from "url"

import { addPluginTemplate, createResolver, defineNuxtModule } from "@nuxt/kit"
import { Nuxt } from "@nuxt/schema"

import consola from "consola"
import Rollbar from "rollbar"

import { getRollbarEnv } from "./io"

const logger = consola.withScope("nuxt:rollbar")

function isTokenValid(token: string | null): boolean {
  return token !== null && token.length > 0
}

export interface ModuleOptions {
  clientAccessToken?: string | null
  serverAccessToken?: string | null
  config?: Rollbar.Configuration
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
  setup(options: ModuleOptions, nuxt: Nuxt) {
    const isClientTokenValid = isTokenValid(options.clientAccessToken || null)
    const isServerTokenValid = isTokenValid(options.serverAccessToken || null)

    // if (!isClientTokenValid && !isServerTokenValid) {
    //   return
    // }

    const { resolve } = createResolver(import.meta.url)
    const templateDir = fileURLToPath(new URL("./template", import.meta.url))
    addPluginTemplate({
      src: resolve(templateDir, "rollbarClientPlugin.mjs"),
      options,
    })

    logger.debug(isClientTokenValid ? "Loaded in client side" : "Skip client side")
    logger.debug(isServerTokenValid ? "Loaded in server side" : "Skip server side")

    if (isServerTokenValid) {
      const rollbar = Rollbar.init({
        ...options.config,
        accessToken: options.serverAccessToken as string | undefined,
      })

      rollbar.errorHandler()

      nuxt.hook("build:error", (error: Error) => {
        rollbar.error(error)
      })

      // nuxt.hook("vue:error", (...args: Parameters<Parameters<typeof onErrorCaptured>[0]>) => {
      //
      // })
    }
  },
})
