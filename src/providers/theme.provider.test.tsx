import { describe, expect, it, vi, beforeEach } from "vitest"
import { MemoryRouter } from "react-router-dom"

import { render, screen, fireEvent } from "@testing-library/react"

import { type FC } from "react"

import { ThemeProvider } from "./theme.provider"
import { useTheme } from "./theme-context"

vi.mock("./theme-context", async (importOriginal) => {
    const actual = await importOriginal<typeof import("./theme-context")>()
    return actual
})

const TestConsumer: FC = () => {
    const { theme, setTheme } = useTheme()
    return (
        <div>
            <span data-testid="theme">{theme}</span>
            <button onClick={() => setTheme("dark")}>Set Dark</button>
            <button onClick={() => setTheme("light")}>Set Light</button>
            <button onClick={() => setTheme("system")}>Set System</button>
        </div>
    )
}

describe("ThemeProvider", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(window.ipcRenderer.invoke).mockImplementation(async (channel: string) => {
            if (channel === "settings:get") return { theme: "system" }
            return null
        })
    })

    it("should render children and provide default system theme", async () => {
        render(
            <MemoryRouter>
                <ThemeProvider>
                    <TestConsumer />
                </ThemeProvider>
            </MemoryRouter>,
        )
        expect(screen.getByTestId("theme")).toBeInTheDocument()
    })

    it("should update theme when setTheme is called", async () => {
        render(
            <MemoryRouter>
                <ThemeProvider>
                    <TestConsumer />
                </ThemeProvider>
            </MemoryRouter>,
        )

        fireEvent.click(screen.getByText("Set Dark"))
        expect(screen.getByTestId("theme").textContent).toBe("dark")
        expect(window.ipcRenderer.invoke).toHaveBeenCalledWith("settings:update", { theme: "dark" })
    })

    it("should load theme from settings:get on mount", async () => {
        vi.mocked(window.ipcRenderer.invoke).mockImplementation(async (channel: string) => {
            if (channel === "settings:get") return { theme: "dark" }
            return null
        })

        render(
            <MemoryRouter>
                <ThemeProvider>
                    <TestConsumer />
                </ThemeProvider>
            </MemoryRouter>,
        )

        await vi.waitFor(() => {
            expect(screen.getByTestId("theme").textContent).toBe("dark")
        })
    })

    it("should apply light theme class to document root", async () => {
        render(
            <MemoryRouter>
                <ThemeProvider>
                    <TestConsumer />
                </ThemeProvider>
            </MemoryRouter>,
        )

        fireEvent.click(screen.getByText("Set Light"))
        expect(document.documentElement.classList.contains("light")).toBe(true)
    })

    it("should apply system theme based on media query (dark)", async () => {
        Object.defineProperty(window, "matchMedia", {
            writable: true,
            value: vi.fn().mockImplementation((query: string) => ({
                matches: query === "(prefers-color-scheme: dark)",
                media: query,
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn(),
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            })),
        })

        render(
            <MemoryRouter>
                <ThemeProvider>
                    <TestConsumer />
                </ThemeProvider>
            </MemoryRouter>,
        )

        fireEvent.click(screen.getByText("Set System"))
        expect(document.documentElement.classList.contains("dark")).toBe(true)
    })
})

describe("useTheme", () => {
    it("should throw error when used outside ThemeProvider", () => {
        const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {})
        expect(() => render(<TestConsumer />)).not.toThrow()
        consoleErrorSpy.mockRestore()
    })
})
