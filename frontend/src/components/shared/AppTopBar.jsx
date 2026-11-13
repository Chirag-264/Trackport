import { Search, Bell, Moon, Sun } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function AppTopBar({ dark, onToggleTheme, showSearch = true }) {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      {showSearch && (
        <div className="relative hidden flex-1 md:block md:max-w-sm lg:max-w-none lg:flex-none">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects, tasks…"
            className="h-10 w-full rounded-xl border-border bg-background pl-9 shadow-soft lg:w-64"
          />
          <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded-md border border-border bg-secondary px-1.5 py-0.5 text-caption font-medium md:inline-block">
            ⌘K
          </kbd>
        </div>
      )}

      <div className={`flex items-center gap-2 ${showSearch ? "lg:ml-auto" : "ml-auto"}`}>
        <Button
          variant="outline"
          size="icon"
          className="relative h-10 w-10 rounded-xl bg-background shadow-soft"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-primary" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          className="h-10 w-10 rounded-xl bg-background shadow-soft"
        >
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background shadow-soft"
          aria-label="Profile"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
              CH
            </AvatarFallback>
          </Avatar>
        </button>
      </div>
    </header>
  );
}
