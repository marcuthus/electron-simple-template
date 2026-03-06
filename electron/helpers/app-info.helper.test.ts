// @vitest-environment node
import { describe, expect, it } from "vitest"

import { getAppVersion, getPlatform } from "./app-info.helper"

describe("AppInfo Helper (Backend)", () => {
    it("should return the correct app version", () => {
        expect(getAppVersion()).toBe("0.0.0")
    })

    it("should return the current platform", () => {
        expect(getPlatform()).toBe(process.platform)
    })
})
