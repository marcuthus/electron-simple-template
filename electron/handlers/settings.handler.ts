import { ipcMain } from "electron"

import { getSettings, saveSettings, type AppSettings } from "../lib/settings"

const themes: AppSettings["theme"][] = ["light", "dark", "system"]
const backupTimeRegex = /^([01]\d|2[0-3]):[0-5]\d$/

/**
 * Valida e filtra o que vem do renderer: só chaves conhecidas e valores válidos chegam ao store
 * (antes qualquer objeto era gravado como veio).
 */
export const sanitizeSettings = (input: unknown): Partial<AppSettings> => {
    if (typeof input !== "object" || input === null) {
        throw new Error("Configurações inválidas")
    }

    const { theme, backupTime } = input as Record<string, unknown>
    const result: Partial<AppSettings> = {}

    if (theme !== undefined) {
        if (!themes.includes(theme as AppSettings["theme"])) throw new Error("Tema inválido")
        result.theme = theme as AppSettings["theme"]
    }

    if (backupTime !== undefined) {
        if (typeof backupTime !== "string" || !backupTimeRegex.test(backupTime)) {
            throw new Error("Horário de backup inválido")
        }
        result.backupTime = backupTime
    }

    return result
}

export const registerSettingsHandlers = () => {
    ipcMain.handle("settings:get", () => {
        return getSettings()
    })

    ipcMain.handle("settings:update", (_, settings: unknown) => {
        // O handler importava "../lib/backup-scheduler", que não existe no template (quebrava o build);
        // se você implementar o agendador de backup, reinicie-o aqui quando backupTime mudar.
        return saveSettings(sanitizeSettings(settings))
    })
}
