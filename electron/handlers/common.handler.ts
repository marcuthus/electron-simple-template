import { ipcMain, shell } from "electron"

const allowedExternalProtocols = ["https:", "http:", "mailto:"]

/**
 * Só abre URLs com protocolos seguros: shell.openExternal com valores como "file:" ou protocolos
 * registrados no sistema pode executar programas locais.
 */
export const isSafeExternalUrl = (url: unknown): url is string => {
    if (typeof url !== "string") return false

    try {
        return allowedExternalProtocols.includes(new URL(url).protocol)
    } catch {
        return false
    }
}

export const registerCommonHandlers = () => {
    ipcMain.handle("shell:open-external", async (_, url: string) => {
        if (!isSafeExternalUrl(url)) {
            throw new Error("URL externa não permitida")
        }

        return await shell.openExternal(url)
    })
}
