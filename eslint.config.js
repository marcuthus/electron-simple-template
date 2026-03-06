import { defineConfig, globalIgnores } from "eslint/config"
import unusedImports from "eslint-plugin-unused-imports"
import reactRefresh from "eslint-plugin-react-refresh"
import prettierPlugin from "eslint-plugin-prettier"
import prettierConfig from "eslint-config-prettier"
import reactHooks from "eslint-plugin-react-hooks"
import tseslint from "typescript-eslint"
import globals from "globals"
import js from "@eslint/js"

export default defineConfig([
    globalIgnores([
        "node_modules/**",
        "dist/**",
        "dist-electron/**",
        "build/**",
        "out/**",
        "coverage/**",
        ".next/**",
        "electron/generated/**",
        "src/generated/**",
        "src/components/ui/**",
    ]),
    {
        files: ["**/*.cjs"],
        languageOptions: {
            globals: globals.commonjs,
        },
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ["src/**/*.{ts,tsx}"],
        plugins: {
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
            prettier: prettierPlugin,
            "unused-imports": unusedImports,
        },
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
            "prettier/prettier": [
                "error",
                {
                    semi: false,
                    singleQuote: false,
                    tabWidth: 4,
                },
            ],
            "@typescript-eslint/no-unused-vars": "off",
            "unused-imports/no-unused-imports": "error",
            "unused-imports/no-unused-vars": [
                "warn",
                {
                    vars: "all",
                    varsIgnorePattern: "^_",
                    args: "after-used",
                    argsIgnorePattern: "^_",
                },
            ],
        },
    },
    {
        files: ["electron/**/*.{ts,tsx}", "prisma/**/*.ts", "*.ts"],
        plugins: {
            prettier: prettierPlugin,
            "unused-imports": unusedImports,
        },
        languageOptions: {
            ecmaVersion: 2020,
            globals: {
                ...globals.node,
                ...globals.browser,
            },
        },
        rules: {
            "prettier/prettier": [
                "error",
                {
                    semi: false,
                    singleQuote: false,
                    tabWidth: 4,
                },
            ],
            "@typescript-eslint/no-unused-vars": "off",
            "unused-imports/no-unused-imports": "error",
            "unused-imports/no-unused-vars": [
                "warn",
                {
                    vars: "all",
                    varsIgnorePattern: "^_",
                    args: "after-used",
                    argsIgnorePattern: "^_",
                },
            ],
            "no-undef": "off",
        },
    },
    prettierConfig,
])
