import { describe, expect, it, vi } from "vitest"

vi.mock("@marcuth/env", () => ({
    env: vi.fn((key) => {
        if (key === "ENCRYPTION_ALGORITHM") return "aes-256-cbc"
        if (key === "ENCRYPTION_KEY") return "00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff"
        if (key === "ENCRYPTION_IV") return "00112233445566778899aabbccddeeff"
        return ""
    }),
}))

import { encrypt, decrypt } from "./crypto"

describe("Crypto Utils", () => {
    it("should encrypt and decrypt string correctly", () => {
        const text = "Hello World123!@#"
        const encrypted = encrypt(text)

        expect(encrypted).not.toBe(text)
        expect(encrypted).toBeTruthy()

        const decrypted = decrypt(encrypted)
        expect(decrypted).toBe(text)
    })
})
