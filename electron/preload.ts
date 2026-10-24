import { contextBridge, ipcRenderer, type IpcRendererEvent } from "electron"

import {
    allowedInvokeChannels,
    allowedReceiveChannels,
    allowedSendChannels,
    isAllowedChannel,
} from "./helpers/ipc-channels.helper"

type Listener = (event: IpcRendererEvent, ...args: unknown[]) => void

const assertAllowed = (channels: readonly string[], channel: unknown) => {
    if (!isAllowedChannel(channels, channel)) {
        throw new Error(`Canal IPC não permitido: ${String(channel)}`)
    }
}

contextBridge.exposeInMainWorld("ipcRenderer", {
    // Retorna uma função para cancelar a inscrição (o listener original não pode ser removido
    // depois de embrulhado, então o antigo "off" nunca funcionava).
    on(channel: string, listener: Listener) {
        assertAllowed(allowedReceiveChannels, channel)

        const wrapped = (event: IpcRendererEvent, ...args: unknown[]) => listener(event, ...args)
        ipcRenderer.on(channel, wrapped)

        return () => {
            ipcRenderer.off(channel, wrapped)
        }
    },
    send(channel: string, ...args: unknown[]) {
        assertAllowed(allowedSendChannels, channel)
        return ipcRenderer.send(channel, ...args)
    },
    invoke(channel: string, ...args: unknown[]) {
        assertAllowed(allowedInvokeChannels, channel)
        return ipcRenderer.invoke(channel, ...args)
    },
})
