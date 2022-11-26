import Rollbar from "rollbar"

export interface ModuleOptions {
  clientAccessToken?: string | null
  serverAccessToken?: string | null
  config?: Rollbar.Configuration
}

// @ts-ignore
declare module "#app" {
  // noinspection JSUnusedGlobalSymbols
  interface NuxtApp {
    $rollbar: Rollbar
  }
}
