import Rollbar from "rollbar"
import { defineNuxtPlugin } from "#app"

const createRollbarInstance = function (accessToken) {
  const config = JSON.parse('<%= options.config %>')
  config.accessToken = accessToken
  return new Rollbar(config)
}

function isValidToken(token) {
  return typeof token === "string" && token.length > 0
}

const serverAccessToken = "<%= options.serverAccessToken %>"

let serverRollbar
if (isValidToken(serverAccessToken)) {
  serverRollbar = createRollbarInstance(serverAccessToken)
}

const clientAccessToken = "<%= options.clientAccessToken %>"

let clientRollbar
if (isValidToken(clientAccessToken)) {
  clientRollbar = createRollbarInstance(clientAccessToken)
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

export default  defineNuxtPlugin((nuxtApp) => {
  // Inject Rollbar to the context as $rollbar
  nuxtApp.provide("rollbar", RollbarAdapter.instance)
})
