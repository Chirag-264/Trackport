import { useLocation } from 'react-router-dom';
import { Bell, Menu, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/components/theme/ThemeProvider';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Your developer productivity at a glance' },
  '/projects': { title: 'Projects', subtitle: 'Manage and track all your projects' },
  '/tasks': { title: 'Tasks', subtitle: 'Organize work across boards and calendars' },
  '/dsa': { title: 'DSA Tracker', subtitle: 'Track your problem-solving progress' },
  '/analytics': { title: 'Analytics', subtitle: 'Insights into your coding activity' },
  '/github': { title: 'GitHub', subtitle: 'Your repositories, commits, and pull requests' },
  '/settings': { title: 'Settings', subtitle: 'Manage your account and preferences' },
};

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const meta = pageTitles[location.pathname] ?? { title: 'TrackPort', subtitle: '' };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl lg:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
        <Menu className="h-5 w-5" />
      </Button>

      <div className="hidden min-w-0 flex-col md:flex">
        <h1 className="truncate text-lg font-semibold leading-tight tracking-tight">{meta.title}</h1>
        <p className="truncate text-xs text-muted-foreground">{meta.subtitle}</p>
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
        </Button>

        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-info text-xs font-semibold text-primary-foreground ring-2 ring-border transition hover:ring-primary/40">
              AK
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Alex Kim</span>
                <span className="text-xs font-normal text-muted-foreground">alex@trackport.dev</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Account settings</DropdownMenuItem>
            <DropdownMenuItem>API tokens</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
