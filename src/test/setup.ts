import "@testing-library/jest-dom/vitest"
import { vi } from "vitest"

// O preload não existe nos testes do renderer: expõe um ipcRenderer simulado.
if (typeof window !== "undefined") {
    window.ipcRenderer = {
        on: vi.fn(() => () => {}),
        send: vi.fn(),
        invoke: vi.fn(),
    }
}

// jsdom não implementa matchMedia (usado pelo ThemeProvider para o tema "system")
if (typeof window !== "undefined" && !window.matchMedia) {
    window.matchMedia = ((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })) as unknown as typeof window.matchMedia
}
