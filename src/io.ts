interface EnvTypes {
  server_key: string | undefined
  client_key: string | undefined
}

type env = keyof EnvTypes

function getEnv<T extends env>(name: T): EnvTypes[T] {
  return process.env[`NUXT_PUBLIC_ROLLBAR_${name}`]
}

export interface RollbarEnvTypes {
  server_key: string | null
  client_key: string | null
}

export type rollbarEnv = keyof RollbarEnvTypes

export function getRollbarEnv<T extends rollbarEnv>(name: T): RollbarEnvTypes[T] {
  return (getEnv(name) as RollbarEnvTypes[T]) || null
}
