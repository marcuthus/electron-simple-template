// @vitest-environment node
import { describe, expect, it, vi } from "vitest"

import { sanitizeSettings } from "./settings.handler"

vi.mock("electron", () => ({ ipcMain: { handle: vi.fn() } }))
vi.mock("../lib/settings", () => ({ getSettings: vi.fn(), saveSettings: vi.fn() }))

describe("sanitizeSettings", () => {
    it("aceita valores válidos", () => {
        expect(sanitizeSettings({ theme: "dark", backupTime: "23:59" })).toEqual({
            theme: "dark",
            backupTime: "23:59",
        })
    })

    it("descarta chaves desconhecidas", () => {
        expect(sanitizeSettings({ theme: "light", isAdmin: true })).toEqual({ theme: "light" })
    })

    it("rejeita valores inválidos", () => {
        expect(() => sanitizeSettings({ theme: "neon" })).toThrow()
        expect(() => sanitizeSettings({ backupTime: "25:00" })).toThrow()
        expect(() => sanitizeSettings(null)).toThrow()
    })
})
