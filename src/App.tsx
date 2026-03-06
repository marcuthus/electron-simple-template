import { Navigate, Route, Routes } from "react-router-dom"
import { type FC } from "react"

import { ThemeProvider } from "./providers/theme.provider"

const App: FC = () => {
    return (
        <ThemeProvider>
            <Routes>
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </ThemeProvider>
    )
}

export default App
