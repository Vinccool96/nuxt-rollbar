import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"
import { $fetch, setup } from "@nuxt/test-utils"

describe("basic", async function () {
  await setup({
    rootDir: fileURLToPath(new URL("../playground", import.meta.url)),
    server: true,
    build: true,
  })

  it("renders the index page", async function () {
    const html = await $fetch("/")
    expect(html).toContain("<div>Nuxt module playground!</div>")
  })
})
