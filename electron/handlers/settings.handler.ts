import { ipcMain } from "electron"

import { getSettings, saveSettings, type AppSettings } from "../lib/settings"
import { restartBackupScheduler } from "../lib/backup-scheduler"

export const registerSettingsHandlers = () => {
    ipcMain.handle("settings:get", () => {
        return getSettings()
    })

    ipcMain.handle("settings:update", (_, settings: Partial<AppSettings>) => {
        const updated = saveSettings(settings)

        if (settings.backupTime) {
            restartBackupScheduler()
        }

        return updated
    })
}
