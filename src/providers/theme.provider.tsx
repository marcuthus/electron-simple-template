import { useEffect, useState, type FC, type ReactNode } from "react"

import { ThemeProviderContext, type Theme } from "./theme-context"

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<Theme>("system")

    useEffect(() => {
        window.ipcRenderer.invoke<{ theme: Theme }>("settings:get").then((settings) => {
            if (settings?.theme) {
                setThemeState(settings.theme)
            }
        })
    }, [])

    useEffect(() => {
        const root = window.document.documentElement
        root.classList.remove("light", "dark")

        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
            root.classList.add(systemTheme)
            return
        }

        root.classList.add(theme)
    }, [theme])

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme)
        window.ipcRenderer.invoke("settings:update", { theme: newTheme })
    }

    const value = {
        theme,
        setTheme,
    }

    return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>
}
