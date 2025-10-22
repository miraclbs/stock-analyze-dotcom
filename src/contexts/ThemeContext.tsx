import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

interface ThemeContextType {
    isDark: boolean
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Function to get initial theme from localStorage or system preference
const getInitialTheme = (): boolean => {
    // Check if we're in browser environment
    if (typeof window === 'undefined') return false

    // First check localStorage
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
        return savedTheme === 'dark'
    }

    // If no saved theme, check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return true
    }

    return false
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [isDark, setIsDark] = useState(getInitialTheme)

    // Apply theme to document on mount and when theme changes
    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        } else {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('theme', 'light')
        }
    }, [isDark])

    const toggleTheme = () => {
        setIsDark(!isDark)
    }

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            <div className={isDark ? 'dark' : ''}>
                {children}
            </div>
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}