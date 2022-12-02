import { defineNuxtPlugin, RuntimeNuxtHooks } from "#app"
import { Hookable } from "hookable"
import { onErrorCaptured } from "vue"

import Rollbar from "rollbar"
import { copyDeep } from "copy-deep"

import { ModuleOptions } from "../config"

export default defineNuxtPlugin((nuxtApp) => {
  const options: ModuleOptions = copyDeep(nuxtApp.payload.config.public.nuxtRollbar)

  const rollbar = Rollbar.init({
    ...options.config,
    accessToken: options.serverAccessToken as string | undefined,
  })

  rollbar.errorHandler()

  const hooks: Hookable<RuntimeNuxtHooks> = nuxtApp.hooks

  hooks.hook("app:error", (err: any) => {
    rollbar.error(err)
  })

  hooks.hook("vue:error", (...args: Parameters<Parameters<typeof onErrorCaptured>[0]>) => {
    rollbar.error(args[0] as Error, args[2])
  })
})
