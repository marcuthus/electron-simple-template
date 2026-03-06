import { describe, expect, it, vi, beforeEach } from "vitest"

const mockStore = {
    store: { backupTime: "12:00", theme: "system" as const },
    set: vi.fn((data: Record<string, unknown>) => {
        Object.assign(mockStore.store, data)
    }),
}

vi.mock("electron-store", () => ({
    default: vi.fn(() => mockStore),
}))

describe("settings", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockStore.store = { backupTime: "12:00", theme: "system" }
    })

    it("should return current settings via getSettings", async () => {
        const { getSettings } = await import("./settings")
        const result = getSettings()
        expect(result).toEqual({ backupTime: "12:00", theme: "system" })
    })

    it("should save and return updated settings via saveSettings", async () => {
        const { saveSettings } = await import("./settings")
        const result = saveSettings({ theme: "dark" })
        expect(mockStore.set).toHaveBeenCalledWith({ theme: "dark" })
        expect(result).toEqual({ backupTime: "12:00", theme: "dark" })
    })

    it("should save partial settings without overwriting other fields", async () => {
        const { saveSettings } = await import("./settings")
        saveSettings({ backupTime: "08:00" })
        expect(mockStore.set).toHaveBeenCalledWith({ backupTime: "08:00" })
    })
})
