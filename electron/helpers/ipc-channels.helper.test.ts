// @vitest-environment node
import { describe, expect, it } from "vitest"

import { allowedInvokeChannels, isAllowedChannel } from "./ipc-channels.helper"

describe("isAllowedChannel", () => {
    it("só permite canais da lista", () => {
        expect(isAllowedChannel(allowedInvokeChannels, "settings:get")).toBe(true)
        expect(isAllowedChannel(allowedInvokeChannels, "fs:read")).toBe(false)
        expect(isAllowedChannel(allowedInvokeChannels, undefined)).toBe(false)
    })
})
