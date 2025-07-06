"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip"
import { SunMoon } from "lucide-react"


export function ThemeToggle() {
    const { theme, setTheme } = useTheme()

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="ghost" size="lg" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} >
                    <SunMoon size={32}/>
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p
                className="bg-neutral-200 text-neutral-950 p-1 rounded-3xl text-[12px] dark:bg-neutral-900 dark:text-neutral-50"
                >Toggle theme</p>
            </TooltipContent>
        </Tooltip>
    )
}
