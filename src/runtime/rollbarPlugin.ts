import Rollbar from "rollbar"
import { defineNuxtPlugin } from "#app"
import { ModuleOptions } from "../config"

export default defineNuxtPlugin((nuxtApp) => {
  const options: ModuleOptions = nuxtApp.payload.config.public.nuxtRollbar

  function createRollbarInstance(accessToken: string) {
    const config = options.config || {}
    config.accessToken = accessToken
    return new Rollbar(config)
  }

  function isValidToken(token: unknown): token is string {
    return typeof token === "string" && token.length > 0
  }

  const serverAccessToken = options.serverAccessToken

  let serverRollbar: Rollbar
  if (isValidToken(serverAccessToken)) {
    serverRollbar = createRollbarInstance(serverAccessToken)
  }

  const clientAccessToken = options.clientAccessToken

  let clientRollbar: Rollbar
  if (isValidToken(clientAccessToken)) {
    clientRollbar = createRollbarInstance(clientAccessToken)
  }

  function noop() {}

  const stubRollbar = Object.create(null)
  Object.defineProperties(
    stubRollbar,
    Object.getOwnPropertyNames(Rollbar.prototype).reduce(function (acc, key) {
      // @ts-ignore
      acc[key] = { value: noop }
      return acc
    }, {})
  )

  const RollbarAdapter = Object.create(null)
  Object.defineProperty(RollbarAdapter, "instance", {
    get() {
      if (isValidToken(serverAccessToken)) {
        if (process.server) {
          return serverRollbar
        }
      }
      if (isValidToken(clientAccessToken)) {
        if (process.client) {
          return clientRollbar
        }
      }
      return stubRollbar
    },
  })

  // Inject Rollbar to the context as $rollbar
  nuxtApp.provide("rollbar", RollbarAdapter.instance)
})
