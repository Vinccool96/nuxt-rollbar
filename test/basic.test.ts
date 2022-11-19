import { fileURLToPath } from "node:url"
// @ts-ignore
import { describe, expect, it, beforeEach } from "vitest"
import { setup, $fetch } from "@nuxt/test-utils"

describe("basic", async function () {
  await setup({
    rootDir: fileURLToPath(new URL("../playground", import.meta.url)),
    server: true,
    build: true,
  })

  it("renders the index page", async () => {
    const html = await $fetch("/")
    expect(html).toContain("<div>Nuxt module playground!</div>")
  })
})
