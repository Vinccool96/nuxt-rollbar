import { fileURLToPath } from "url"

import { addPlugin, addPluginTemplate, createResolver, defineNuxtModule, isNuxt3 } from "@nuxt/kit"
import { Nuxt } from "@nuxt/schema"

import { copyDeep } from "copy-deep"

import consola from "consola"
import Rollbar from "rollbar"

import { getRollbarEnv } from "./io"
import { ModuleOptions } from "./config"

export type { ModuleOptions }

const logger = consola.withScope("nuxt:rollbar")

function isTokenValid(token: string | null): boolean {
  return token !== null && token.length > 0
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
    clientAccessToken: getRollbarEnv("client_key") || null,
    serverAccessToken: getRollbarEnv("server_key") || null,
    config: {},
  },
  setup(options: ModuleOptions, nuxt: Nuxt) {
    const realOptions = copyDeep(options)
    console.log(JSON.stringify(nuxt.options.runtimeConfig))
    if (isNuxt3(nuxt)) {
      // @ts-ignore
      nuxt.options.runtimeConfig.public.nuxtRollbar = realOptions
    } else {
      // @ts-ignore
      nuxt.options.publicRuntimeConfig.nuxtRollbar = realOptions
    }

    const isClientTokenValid = isTokenValid(realOptions.clientAccessToken || null)
    const isServerTokenValid = isTokenValid(realOptions.serverAccessToken || null)

    // if (!isClientTokenValid && !isServerTokenValid) {
    //   return
    // }

    const { resolve } = createResolver(import.meta.url)
    const runtimeDir = fileURLToPath(new URL("./runtime", import.meta.url))
    nuxt.options.build.transpile.push(runtimeDir)
    addPlugin(resolve(runtimeDir, "rollbarPlugin"))

    logger.debug(isClientTokenValid ? "Loaded in client side" : "Skip client side")
    logger.debug(isServerTokenValid ? "Loaded in server side" : "Skip server side")

    if (isServerTokenValid) {
      const rollbar = Rollbar.init({
        ...realOptions.config,
        accessToken: realOptions.serverAccessToken as string | undefined,
      })

      rollbar.errorHandler()

      // nuxt.hook("vue:error", (...args: Parameters<Parameters<typeof onErrorCaptured>[0]>) => {
      //
      // })
    }
  },
  hooks: {},
})
