import { BrowserWindow, Menu, app, shell, type MenuItemConstructorOptions } from "electron"

import path from "node:path"

import { appRootDir, distDir, vitePublicDir, __dirname } from "./helpers/constants.helper"
import { isSafeExternalUrl, registerCommonHandlers } from "./handlers/common.handler"
import { registerSettingsHandlers } from "./handlers/settings.handler"

process.env.APP_ROOT = appRootDir
process.env.DIST = distDir
process.env.VITE_PUBLIC = vitePublicDir

let win: BrowserWindow | null

const createWindow = () => {
    win = new BrowserWindow({
        icon: path.join(vitePublicDir, "logo.png"),
        webPreferences: {
            preload: path.join(__dirname, "preload.mjs"),
            // Explícito para não depender de padrões que mudaram entre versões do Electron
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true,
        },
    })

    // Links com target="_blank"/window.open abrem no navegador do sistema (só protocolos seguros)
    // em vez de criar uma nova janela com acesso ao preload.
    win.webContents.setWindowOpenHandler(({ url }) => {
        if (isSafeExternalUrl(url)) {
            shell.openExternal(url)
        }

        return { action: "deny" }
    })

    // Impede que a janela navegue para fora do app (ex.: via link injetado).
    win.webContents.on("will-navigate", (event, url) => {
        const appUrl = process.env.VITE_DEV_SERVER_URL

        if (appUrl ? url.startsWith(appUrl) : url.startsWith("file://")) return

        event.preventDefault()
    })

    win.webContents.on("did-finish-load", () => {
        win?.webContents.send("main-process-message", new Date().toLocaleString())
    })

    win.maximize()

    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL)
    } else {
        win.loadFile(path.join(distDir, "index.html"))
    }

    const template: MenuItemConstructorOptions[] = [
        {
            label: "Arquivo",
            submenu: [{ role: "quit", label: "Sair" }],
        },
        {
            label: "Editar",
            submenu: [
                { role: "undo", label: "Desfazer" },
                { role: "redo", label: "Refazer" },
                { type: "separator" },
                { role: "cut", label: "Recortar" },
                { role: "copy", label: "Copiar" },
                { role: "paste", label: "Colar" },
            ],
        },
        {
            label: "Visualizar",
            submenu: [
                { role: "reload", label: "Recarregar" },
                { role: "forceReload", label: "Forçar Recarregamento" },
                { role: "toggleDevTools", label: "Ferramentas do Desenvolvedor" },
                { type: "separator" },
                { role: "resetZoom", label: "Zoom Real" },
                { role: "zoomIn", label: "Aumentar Zoom" },
                { role: "zoomOut", label: "Diminuir Zoom" },
                { type: "separator" },
                { role: "togglefullscreen", label: "Tela Cheia" },
            ],
        },
        {
            label: "Janela",
            submenu: [
                { role: "minimize", label: "Minimizar" },
                { role: "close", label: "Fechar" },
            ],
        },
    ]

    const menu = Menu.buildFromTemplate(template)

    Menu.setApplicationMenu(menu)
}

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit()
        win = null
    }
})

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

app.whenReady().then(() => {
    // Estava registrado duas vezes: o segundo ipcMain.handle lança "second handler" e o app não abria
    registerCommonHandlers()
    // theme.provider usa settings:get/update, que nunca eram registrados
    registerSettingsHandlers()
    createWindow()
})
