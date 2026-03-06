import { describe, expect, it, vi } from "vitest"

vi.mock("electron", () => ({
    app: {
        isPackaged: false,
    },
}))

describe("Constants Helper", () => {
    it("should have appRootDir defined", async () => {
        const { appRootDir } = await import("./constants.helper")
        expect(appRootDir).toBeDefined()
        expect(appRootDir).toContain("electron")
    })

    it("should have distDir defined", async () => {
        const { distDir } = await import("./constants.helper")
        expect(distDir).toBeDefined()
        expect(distDir).toContain("dist")
    })

    it("should have vitePublicDir defined", async () => {
        const { vitePublicDir } = await import("./constants.helper")
        expect(vitePublicDir).toBeDefined()
    })
})
