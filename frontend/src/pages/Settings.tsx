import { useState } from 'react';
import {
  User,
  Palette,
  Bell,
  Shield,
  Sliders,
  Moon,
  Sun,
  Monitor,
  Check,
  Smartphone,
  Key,
  LogOut,
  Download,
  Trash2,
  Globe,
  Clock,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { profile, notificationPreferences, securityLog, preferences, themes, accentColors } from '@/data/settings';
import { useTheme } from '@/components/theme/ThemeProvider';
import { cn } from '@/lib/utils';

export default function Settings() {
  const { theme, setTheme, accent, setAccent } = useTheme();
  const [notifStates, setNotifStates] = useState(() =>
    Object.fromEntries(notificationPreferences.map((n) => [n.id, n.enabled]))
  );
  const [prefStates, setPrefStates] = useState(() =>
    Object.fromEntries(preferences.map((p) => [p.id, p.enabled]))
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 lg:p-6">
      <PageHeader title="Settings" description="Manage your account, preferences, and security." />

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="h-9 w-full justify-start overflow-x-auto sm:w-auto">
          <TabsTrigger value="profile" className="gap-1.5 text-xs"><User className="h-3.5 w-3.5" />Profile</TabsTrigger>
          <TabsTrigger value="theme" className="gap-1.5 text-xs"><Palette className="h-3.5 w-3.5" />Theme</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5 text-xs"><Bell className="h-3.5 w-3.5" />Notifications</TabsTrigger>
          <TabsTrigger value="security" className="gap-1.5 text-xs"><Shield className="h-3.5 w-3.5" />Security</TabsTrigger>
          <TabsTrigger value="preferences" className="gap-1.5 text-xs"><Sliders className="h-3.5 w-3.5" />Preferences</TabsTrigger>
        </TabsList>

        {/* Profile */}
        <TabsContent value="profile" className="space-y-4">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="text-base">Profile</CardTitle>
              <CardDescription>Update your personal information and bio.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-info text-xl font-semibold text-primary-foreground">
                  {profile.avatar}
                </div>
                <div className="space-y-1">
                  <Button size="sm" variant="outline">Change Avatar</Button>
                  <p className="text-xs text-muted-foreground">JPG, PNG, or GIF. Max 2MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={profile.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" defaultValue={profile.username} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={profile.email} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" defaultValue={profile.company} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" defaultValue={profile.location} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" defaultValue={profile.website} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" rows={3} defaultValue={profile.bio} />
                <p className="text-xs text-muted-foreground">Brief description for your profile. Max 200 characters.</p>
              </div>

              <div className="flex justify-end gap-2 border-t border-border pt-4">
                <Button variant="outline" size="sm">Cancel</Button>
                <Button size="sm">Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Theme */}
        <TabsContent value="theme" className="space-y-4">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="text-base">Appearance</CardTitle>
              <CardDescription>Choose how TrackPort looks to you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="mb-3 block">Theme</Label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {themes.map((t) => {
                    const Icon = t.id === 'light' ? Sun : t.id === 'dark' ? Moon : Monitor;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id === 'system' ? 'dark' : (t.id as 'light' | 'dark'))}
                        className={cn(
                          'group relative flex flex-col items-start gap-2 rounded-xl border-2 p-4 text-left transition-all',
                          (theme === t.id || (t.id === 'system' && false))
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/30'
                        )}
                      >
                        <div className="flex w-full items-center justify-between">
                          <Icon className="h-5 w-5" />
                          {theme === t.id && (
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                              <Check className="h-3 w-3" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{t.name}</p>
                          <p className="text-xs text-muted-foreground">{t.description}</p>
                        </div>
                        <div className="flex gap-1.5">
                          {t.colors.map((c, i) => (
                            <div key={i} className="h-6 w-6 rounded-md border border-border" style={{ backgroundColor: c }} />
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <Label className="mb-3 block">Accent Color</Label>
                <div className="flex flex-wrap gap-3">
                  {accentColors.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setAccent(c.id as 'blue' | 'green' | 'orange' | 'purple' | 'red')}
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full ring-2 ring-offset-2 ring-offset-background transition-all',
                        accent === c.id ? 'ring-foreground' : 'ring-transparent'
                      )}
                      style={{ backgroundColor: c.value }}
                    >
                      {accent === c.id && <Check className="h-4 w-4 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-border pt-4">
                <Button variant="outline" size="sm" onClick={() => setAccent('blue')}>Reset</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-4">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="text-base">Notification Preferences</CardTitle>
              <CardDescription>Choose what you want to be notified about.</CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-border">
              {notificationPreferences.map((n) => (
                <div key={n.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                  <div className="min-w-0 pr-4">
                    <p className="text-sm font-medium">{n.label}</p>
                    <p className="text-xs text-muted-foreground">{n.description}</p>
                  </div>
                  <Switch
                    checked={notifStates[n.id]}
                    onCheckedChange={(checked) =>
                      setNotifStates((prev) => ({ ...prev, [n.id]: checked }))
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-4">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="text-base">Security</CardTitle>
              <CardDescription>Manage your password and security settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="current">Current Password</Label>
                  <Input id="current" type="password" placeholder="••••••••" />
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="new">New Password</Label>
                    <Input id="new" type="password" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm">Confirm Password</Label>
                    <Input id="confirm" type="password" placeholder="••••••••" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button size="sm">Update Password</Button>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Two-Factor Authentication</p>
                    <p className="text-xs text-muted-foreground">Enabled · Authenticator app</p>
                  </div>
                </div>
                <Badge variant="secondary" className="gap-1 text-success">
                  <Check className="h-3 w-3" />
                  Active
                </Badge>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10 text-info">
                    <Key className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">API Tokens</p>
                    <p className="text-xs text-muted-foreground">3 active tokens</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Manage</Button>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Active Sessions</p>
                    <p className="text-xs text-muted-foreground">2 devices currently signed in</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">View All</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="text-base">Security Log</CardTitle>
              <CardDescription>Recent account security events.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {securityLog.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 px-5 py-3.5">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{log.event}</p>
                      <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Globe className="h-3 w-3" />{log.location}</span>
                        <span>·</span>
                        <span>{log.device}</span>
                      </div>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">{log.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences" className="space-y-4">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="text-base">General Preferences</CardTitle>
              <CardDescription>Customize your TrackPort experience.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label>Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="ja">Japanese</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select defaultValue="pst">
                  <SelectTrigger className="w-full sm:w-[280px]">
                    <Clock className="mr-2 h-3.5 w-3.5" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pst">Pacific Time (PST, UTC-8)</SelectItem>
                    <SelectItem value="est">Eastern Time (EST, UTC-5)</SelectItem>
                    <SelectItem value="gmt">Greenwich Mean Time (UTC+0)</SelectItem>
                    <SelectItem value="cet">Central European Time (UTC+1)</SelectItem>
                    <SelectItem value="ist">India Standard Time (UTC+5:30)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="divide-y divide-border">
                {preferences.map((p) => (
                  <div key={p.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                    <div className="min-w-0 pr-4">
                      <p className="text-sm font-medium">{p.label}</p>
                      <p className="text-xs text-muted-foreground">{p.description}</p>
                    </div>
                    <Switch
                      checked={prefStates[p.id]}
                      onCheckedChange={(checked) =>
                        setPrefStates((prev) => ({ ...prev, [p.id]: checked }))
                      }
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover border-destructive/30">
            <CardHeader>
              <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible account actions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="text-sm font-medium">Export Account Data</p>
                  <p className="text-xs text-muted-foreground">Download all your data as a JSON archive.</p>
                </div>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Download className="h-3.5 w-3.5" />
                  Export
                </Button>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                <div>
                  <p className="text-sm font-medium text-destructive">Delete Account</p>
                  <p className="text-xs text-muted-foreground">Permanently delete your account and all data.</p>
                </div>
                <Button variant="destructive" size="sm" className="gap-1.5">
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </Button>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="text-sm font-medium">Sign Out Everywhere</p>
                  <p className="text-xs text-muted-foreground">Sign out of all active sessions.</p>
                </div>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
