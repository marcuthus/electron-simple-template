import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { readFileSync } from "node:fs"

const __dirname = dirname(fileURLToPath(import.meta.url))
const appRootDir = join(__dirname, "../..")
const packageJson = JSON.parse(readFileSync(join(appRootDir, "package.json"), "utf-8"))

export const getAppVersion = () => {
    return packageJson.version
}

export const getPlatform = () => {
    return process.platform
}
