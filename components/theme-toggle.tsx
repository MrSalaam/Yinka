"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"

export function ThemeToggle() {
    const [mounted, setMounted] = useState(false)
    const { resolvedTheme, setTheme } = useTheme()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <button
                className="relative w-9 h-9 rounded-lg border-2 border-border bg-background flex items-center justify-center"
                aria-label="Toggle theme"
            >
                <div className="w-4 h-4" />
            </button>
        )
    }

    const isDark = resolvedTheme === "dark"

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="relative w-10 h-10 rounded-lg bg-background hover:border-primary hover:bg-primary/5 transition-all duration-300 flex items-center justify-center group overflow-hidden"
            aria-label="Toggle theme"
        >
            <MoonIcon
                className={`w-4 h-4 text-foreground absolute transition-all duration-500 ${isDark ? 'rotate-90 scale-0' : 'rotate-0 scale-100'
                    }`}
            />
            <SunIcon
                className={`w-4 h-4 text-foreground absolute transition-all duration-500 ${isDark ? 'rotate-0 scale-100' : 'rotate-90 scale-0'
                    }`}
            />
        </button>
    )
}
