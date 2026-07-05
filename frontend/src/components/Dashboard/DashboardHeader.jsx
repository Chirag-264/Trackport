import React from 'react'
import { Search, Bell, Moon, Sun } from 'lucide-react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback } from '../ui/avatar'

const DashboardHeader = ({dark, setDark}) => {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight lg:text-[2rem]">
                Welcome back, Chirag <span className="inline-block">👋</span>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
                Let's build, learn and ship today.
            </p>
        </div>
        <div className="flex items-center gap-2">
            <div className="relative hidden md:block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search projects, tasks…"
                  className="h-10 w-64 rounded-xl border-border bg-background pl-9 shadow-soft"
                />
                <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded-md border        border-border bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground md:inline-block">
                  ⌘K
                </kbd>
            </div>
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl bg-background shadow-soft relative">
                <Bell className="h-4 w-4" />
                <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-primary" />
            </Button>
            <Button
                variant="outline"
                size="icon"
                onClick={() => setDark((v) => !v)}
                aria-label="Toggle theme"
                className="h-10 w-10 rounded-xl bg-background shadow-soft"
            >
                {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-background shadow-soft border border-border" aria-label="Profile">
                <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">CH</AvatarFallback>
                </Avatar>
            </button>
        </div>
    </header>
  )
}

export default DashboardHeader