import { app } from "electron"

import path from "node:path"
import url from "node:url"

export const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
export const appRootDir = path.join(__dirname, "..")
export const distDir = path.join(__dirname, "../dist")
export const vitePublicDir = app.isPackaged ? distDir : path.join(__dirname, "../public")
