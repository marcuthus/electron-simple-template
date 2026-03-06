import Store from "electron-store"

export type AppSettings = {
    backupTime: string
    theme: "light" | "dark" | "system"
}

const defaults: AppSettings = {
    backupTime: "12:00",
    theme: "system",
}

const store = new Store<AppSettings>({ defaults })

export const getSettings = (): AppSettings => {
    return store.store
}

export const saveSettings = (settings: Partial<AppSettings>): AppSettings => {
    store.set(settings)
    return store.store
}
