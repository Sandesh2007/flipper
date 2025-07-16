"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { toast } from "sonner"


export function ThemeToggle() {
    const { theme, setTheme } = useTheme()

    return (
        <Button variant="ghost" size="lg" onClick={() => {
            setTheme(theme === "dark" ? "light" : "dark")
            }} >
            {/* <SunMoon size={32} /> */}
            {theme === "dark" ? <Sun/> : <Moon/>}
        </Button>

    )
}
