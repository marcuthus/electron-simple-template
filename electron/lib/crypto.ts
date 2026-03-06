import { env } from "@marcuth/env"

import { createCipheriv, createDecipheriv } from "node:crypto"

const algorithm = env("ENCRYPTION_ALGORITHM")
const key = Buffer.from(env("ENCRYPTION_KEY"), "hex")
const iv = Buffer.from(env("ENCRYPTION_IV"), "hex")

export const encrypt = (text: string): string => {
    const cipher = createCipheriv(algorithm, key, iv)
    let encrypted = cipher.update(text, "utf8", "hex")
    encrypted += cipher.final("hex")
    return encrypted
}

export const decrypt = (encryptedText: string): string => {
    const decipher = createDecipheriv(algorithm, key, iv)
    let decrypted = decipher.update(encryptedText, "hex", "utf8")
    decrypted += decipher.final("utf8")
    return decrypted
}
