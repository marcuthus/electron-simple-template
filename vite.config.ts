/// <reference types="vitest" />
import electron from "vite-plugin-electron/simple"
import { defineConfig } from "vitest/config"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"

import path from "node:path"

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        ...(process.env.VITEST
            ? []
            : [
                  electron({
                      main: {
                          entry: "electron/main.ts",
                          vite: {
                              build: {
                                  rollupOptions: {
                                      output: {
                                          entryFileNames: "[name].js",
                                      },
                                      external: (id: string) => {
                                          const isRelative = id.startsWith(".") || path.isAbsolute(id)
                                          return !isRelative
                                      },
                                  },
                              },
                          },
                      },
                      preload: {
                          input: path.join(__dirname, "electron/preload.ts"),
                      },
                      renderer: {},
                  }),
              ]),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    test: {
        globals: true,
        setupFiles: "./src/test/setup.ts",
        environment: "jsdom",
        coverage: {
            provider: "v8",
            include: ["electron/**/*"],
            exclude: [
                "src/**/*",
                "electron/main.ts",
                "electron/preload.ts",
                "**/*.test.ts",
                "**/*.test.tsx",
                "**/*.spec.ts",
                "**/*.spec.tsx",
            ],
            thresholds: {
                lines: 100,
                functions: 100,
                branches: 100,
                statements: 100,
            },
        },
    },
})
