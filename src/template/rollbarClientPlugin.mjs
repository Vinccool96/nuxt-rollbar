import Rollbar from "rollbar"
import { defineNuxtPlugin } from "#app"

const createRollbarInstance = function (accessToken) {
  const config = JSON.parse(JSON.stringify(<% options.config %>))
  config.accessToken = accessToken
  return new Rollbar(config)
}

function isValidToken(token) {
  return typeof token === "string" && token.length > 0
}

let serverRollbar
if (isValidToken(<%= options.serverAccessToken %>)) {
  serverRollbar = createRollbarInstance("<%= options.serverAccessToken %>")
}

let clientRollbar
if (isValidToken(<%= options.clientAccessToken %>)) {
  clientRollbar = createRollbarInstance("<%= options.clientAccessToken %>")
}

function noop() {}

const stubRollbar = Object.create(null)
Object.defineProperties(
  stubRollbar,
  Object.getOwnPropertyNames(Rollbar.prototype).reduce(function (acc, key) {
    acc[key] = { value: noop }
    return acc
  }, {})
)

const RollbarAdapter = Object.create(null)
Object.defineProperty(RollbarAdapter, "instance", {
  get() {
    if (isValidToken(<%= options.serverAccessToken %>)) {
      if (process.server) {
        return serverRollbar
      }
    }
    if (isValidToken(<%= options.clientAccessToken %>)) {
      if (process.client) {
        return clientRollbar
      }
    }
    return stubRollbar
  },
})

export default  defineNuxtPlugin((nuxtApp) => {
  // Inject Rollbar to the context as $rollbar
  nuxtApp.provide("rollbar", RollbarAdapter.instance)
})
