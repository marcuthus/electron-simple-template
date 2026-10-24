export {}

declare global {
    interface Window {
        ipcRenderer: {
            /** Retorna uma função que cancela a inscrição */
            on: (channel: string, listener: (...args: unknown[]) => void) => () => void
            send: (channel: string, ...args: unknown[]) => void
            invoke: <T>(channel: string, ...args: unknown[]) => Promise<T>
        }
    }
}
