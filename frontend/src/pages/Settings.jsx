import React, { useEffect, useState } from 'react';
import { User, Mail, GraduationCap, AtSign, Moon, Sun, Check, Save, Loader2, Github, Code2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/hooks/useTheme';
import { updateProfile } from '@/services/user.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function valuesFromUser(user) {
  return {
    name: user?.name || '',
    userName: user?.userName || '',
    college: user?.college || '',
    branch: user?.branch || '',
    graduationYear: user?.graduationYear || '',
    githubUsername: user?.githubUsername || '',
    leetcodeUsername: user?.leetcodeUsername || '',
    codeforcesUsername: user?.codeforcesUsername || '',
    dailyGoal: user?.dailyGoal || 2
  };
}

export default function Settings() {
  const { user, updateUser } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const [form, setForm] = useState(() => valuesFromUser(user));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { setForm(valuesFromUser(user)); }, [user]);


  const change = (field) => (event) => {
    const value = field === 'dailyGoal' ? Number(event.target.value) : event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
    setSaved(false);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setSaved(false);
    setError('');
    try {
      const response = await updateProfile({
        ...form,
        graduationYear: form.graduationYear ? Number(form.graduationYear) : null,
        dailyGoal: Number(form.dailyGoal)
      });
      updateUser(response.data.user);
      setSaved(true);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not save your profile.');
    } finally {
      setSaving(false);
    }
  };

  const field = (id, label, icon, options = {}) => (
    <div>
      <Label htmlFor={id} className="text-xs font-semibold text-slate-600 dark:text-slate-300">{label}</Label>
      <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl px-3.5 h-11 border border-slate-200/80 dark:border-slate-700 mt-1.5">
        {icon}
        <Input id={id} type={options.type || 'text'} min={options.min} max={options.max} minLength={options.minLength} maxLength={options.maxLength} pattern={options.pattern} required={options.required} value={form[id]} onChange={change(id)} className="bg-transparent border-0 shadow-none focus-visible:ring-0 h-full px-0 text-xs sm:text-sm" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Account Settings</h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Your profile and platform names are stored with your account.</p>
      </div>

      <div className="rounded-[28px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
        <h3 className="font-bold text-base text-slate-900 dark:text-white mb-5">Student developer profile</h3>
        {error && <p role="alert" className="mb-4 rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">{error}</p>}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field('name', 'Full name', <User className="h-4 w-4 text-slate-400" />, { maxLength: 50, minLength: 2, required: true })}
            {field('userName', 'Username', <AtSign className="h-4 w-4 text-slate-400" />, { maxLength: 30, minLength: 3, required: true })}
          </div>
          <div>
            <Label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Email address (read only)</Label>
            <div className="flex items-center gap-2.5 bg-slate-100 dark:bg-slate-800/50 rounded-2xl px-3.5 h-11 border border-slate-200/60 dark:border-slate-700/60 mt-1.5 opacity-75"><Mail className="h-4 w-4 text-slate-400" /><Input disabled value={user?.email || ''} className="bg-transparent border-0 shadow-none h-full px-0 text-xs sm:text-sm" /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">{field('college', 'College / university', <GraduationCap className="h-4 w-4 text-slate-400" />)}</div>
            {field('branch', 'Branch / course', <Code2 className="h-4 w-4 text-slate-400" />)}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field('graduationYear', 'Graduation year', <GraduationCap className="h-4 w-4 text-slate-400" />, { type: 'number', min: 2020, max: 2035 })}
            {field('dailyGoal', 'Daily DSA goal', <Check className="h-4 w-4 text-slate-400" />, { type: 'number', min: 1, max: 100, required: true })}
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Developer platform usernames</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {field('githubUsername', 'GitHub', <Github className="h-4 w-4 text-slate-400" />)}
              {field('leetcodeUsername', 'LeetCode', <Code2 className="h-4 w-4 text-slate-400" />)}
              {field('codeforcesUsername', 'Codeforces', <Code2 className="h-4 w-4 text-slate-400" />)}
            </div>
          </div>
          <div className="pt-2 flex items-center justify-between gap-3">
            <p aria-live="polite" className="text-xs text-emerald-600">{saved ? 'Profile saved.' : ''}</p>
            <Button type="submit" disabled={saving} className="rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs h-11 px-6 gap-2">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}{saving ? 'Saving…' : saved ? 'Saved' : 'Save profile'}</Button>
          </div>
        </form>
      </div>

      <div className="rounded-[28px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs flex items-center justify-between gap-4">
        <div><h3 className="font-bold text-base text-slate-900 dark:text-white">Interface appearance</h3><p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Switch between the light mountain and dark cosmic themes.</p></div>
        <button type="button" onClick={toggleTheme} className="h-11 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200"><>{dark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-purple-600" />}{dark ? 'Light mode' : 'Dark mode'}</></button>
      </div>
    </div>
  );
}
