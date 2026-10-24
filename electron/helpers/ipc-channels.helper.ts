/**
 * Canais IPC que o renderer pode usar. O preload só repassa esses canais: expor o ipcRenderer
 * inteiro permitiria que qualquer script carregado na página (ex.: XSS) chamasse qualquer handler
 * registrado no processo principal.
 * Ao criar um novo handler/evento, adicione o canal aqui.
 */
export const allowedInvokeChannels = ["shell:open-external", "settings:get", "settings:update"] as const
export const allowedSendChannels = [] as const
export const allowedReceiveChannels = ["main-process-message"] as const

export const isAllowedChannel = (channels: readonly string[], channel: unknown): channel is string => {
    return typeof channel === "string" && channels.includes(channel)
}
