import { ipcMain, shell } from "electron"

export const registerCommonHandlers = () => {
    ipcMain.handle("shell:open-external", async (_, url: string) => {
        return await shell.openExternal(url)
    })
}
