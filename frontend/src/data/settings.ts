export const profile = {
  name: 'Alex Kim',
  username: 'alexkim',
  email: 'alex@trackport.dev',
  bio: 'Full-stack engineer building developer tools. Passionate about clean architecture, type safety, and great developer experience.',
  location: 'San Francisco, CA',
  website: 'https://alexkim.dev',
  company: 'TrackPort Inc.',
  avatar: 'AK',
  joinedDate: 'January 2024',
  timezone: 'America/Los_Angeles (PST, UTC-8)',
};

export const notificationPreferences = [
  { id: 'n1', label: 'Email notifications', description: 'Receive emails about your account activity.', enabled: true },
  { id: 'n2', label: 'Push notifications', description: 'Get real-time push notifications in your browser.', enabled: true },
  { id: 'n3', label: 'Task reminders', description: 'Daily reminders for tasks due soon.', enabled: true },
  { id: 'n4', label: 'Weekly digest', description: 'A summary of your activity every Monday.', enabled: false },
  { id: 'n5', label: 'GitHub activity', description: 'Notifications for commits, PRs, and mentions.', enabled: true },
  { id: 'n6', label: 'DSA streak alerts', description: 'Remind me to keep my daily DSA streak alive.', enabled: true },
  { id: 'n7', label: 'Product updates', description: 'News about new features and improvements.', enabled: false },
  { id: 'n8', label: 'Security alerts', description: 'Critical security and account access alerts.', enabled: true },
];

export const securityLog = [
  { id: 's1', event: 'Password changed', device: 'MacBook Pro · Chrome', location: 'San Francisco, CA', time: '2 days ago' },
  { id: 's2', event: 'New device login', device: 'iPhone 15 · Safari', location: 'San Francisco, CA', time: '5 days ago' },
  { id: 's3', event: 'API token generated', device: 'MacBook Pro · Chrome', location: 'San Francisco, CA', time: '1 week ago' },
  { id: 's4', event: 'Two-factor enabled', device: 'MacBook Pro · Chrome', location: 'San Francisco, CA', time: '2 weeks ago' },
  { id: 's5', event: 'Email updated', device: 'MacBook Pro · Chrome', location: 'San Francisco, CA', time: '3 weeks ago' },
];

export const preferences = [
  { id: 'pref1', label: 'Compact mode', description: 'Reduce padding and font sizes for denser layouts.', enabled: false },
  { id: 'pref2', label: 'Show keyboard shortcuts', description: 'Display shortcut hints on hoverable elements.', enabled: true },
  { id: 'pref3', label: 'Auto-save drafts', description: 'Automatically save task and document drafts.', enabled: true },
  { id: 'pref4', label: 'Beta features', description: 'Enable early access to features in development.', enabled: false },
  { id: 'pref5', label: 'Analytics sharing', description: 'Share anonymous usage data to improve TrackPort.', enabled: true },
];

export const themes = [
  { id: 'light', name: 'Light', description: 'Clean and bright', colors: ['#ffffff', '#f4f5f7', '#3b82f6'] },
  { id: 'dark', name: 'Dark', description: 'Easy on the eyes', colors: ['#0a0c10', '#16181d', '#3b82f6'] },
  { id: 'system', name: 'System', description: 'Match your OS', colors: ['#ffffff', '#0a0c10', '#3b82f6'] },
];

export const accentColors = [
  { id: 'blue', name: 'Blue', value: 'hsl(221 83% 53%)' },
  { id: 'green', name: 'Green', value: 'hsl(142 71% 45%)' },
  { id: 'orange', name: 'Orange', value: 'hsl(38 92% 50%)' },
  { id: 'purple', name: 'Purple', value: 'hsl(280 65% 60%)' },
  { id: 'red', name: 'Red', value: 'hsl(0 84% 60%)' },
];
