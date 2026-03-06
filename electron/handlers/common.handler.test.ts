import { describe, expect, it, vi, beforeEach } from "vitest"
import { ipcMain, shell } from "electron"

import { registerCommonHandlers } from "./common.handler"

vi.mock("electron", () => ({
    ipcMain: {
        handle: vi.fn(),
    },
    shell: {
        openExternal: vi.fn(),
    },
}))

describe("Common Handlers", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        registerCommonHandlers()
    })

    const getHandler = (channel: string) => {
        return vi.mocked(ipcMain.handle).mock.calls.find((call) => call[0] === channel)![1] as (
            event: unknown,
            ...args: unknown[]
        ) => Promise<unknown>
    }

    it("should register shell:open-external handler and open url", async () => {
        const handler = getHandler("shell:open-external")

        vi.mocked(shell.openExternal).mockResolvedValue(undefined)

        await handler({}, "https://example.com")

        expect(shell.openExternal).toHaveBeenCalledWith("https://example.com")
    })
})
