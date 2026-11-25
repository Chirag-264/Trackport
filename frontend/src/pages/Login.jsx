import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const oauthError = new URLSearchParams(location.search).get('oauth');

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setSubmitting(true);
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Invalid email or password. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-[url('/loginLight.jpg')] dark:bg-[url('/starsDark.jpg')] bg-cover bg-center p-4">
      {/* Frosted Glass Login Card matching Inspiration 1 */}
      <div className="w-full max-w-[400px] rounded-[36px] bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl p-8 sm:p-9 shadow-2xl border border-white/60 dark:border-white/10 transition-all">
        {/* Top Floating App Icon */}
        <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 shadow-md border border-slate-100 dark:border-slate-700/60 flex items-center justify-center mx-auto mb-6 text-slate-800 dark:text-slate-100">
          <LogIn className="h-6 w-6 stroke-[2.2]" />
        </div>

        {/* Heading & Subtitle */}
        <div className="text-center space-y-2 mb-7">
          <h1 className="text-2xl sm:text-[1.7rem] font-bold tracking-tight text-slate-900 dark:text-white">
            Sign in with email
          </h1>
          <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-[280px] mx-auto">
            Track your projects, tasks, deadlines, and developer journey. All in one place.
          </p>
        </div>

        {(error || (oauthError && oauthError.endsWith('-unconfigured')
          ? `Sign-in provider is not configured on this server (${oauthError.split('-')[0]}). Use email sign-in or add the provider credentials to backend/.env.`
          : oauthError ? 'Sign-in with that provider failed. Please try again or use email sign-in.' : '')) && (
          <div className="mb-5 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="font-medium">{error || (oauthError && oauthError.endsWith('-unconfigured')
              ? `Sign-in provider is not configured on this server (${oauthError.split('-')[0]}). Use email sign-in or add the provider credentials to backend/.env.`
              : 'Sign-in with that provider failed. Please try again or use email sign-in.')}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Email input pill */}
          <div className="h-12 rounded-2xl bg-slate-100/80 dark:bg-slate-800/70 px-4 flex items-center gap-3 border border-transparent focus-within:border-slate-300 dark:focus-within:border-slate-600 focus-within:bg-white dark:focus-within:bg-slate-800 transition-all">
            <Mail className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
            <input
              id="email"
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent outline-none w-full text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          {/* Password input pill */}
          <div className="h-12 rounded-2xl bg-slate-100/80 dark:bg-slate-800/70 px-4 flex items-center gap-3 border border-transparent focus-within:border-slate-300 dark:focus-within:border-slate-600 focus-within:bg-white dark:focus-within:bg-slate-800 transition-all">
            <Lock className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent outline-none w-full text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {/* Forgot password */}
          <div className="text-right">
            <button
              type="button"
              onClick={() => setError('Password reset is not available yet. Please contact the project administrator.')}
              className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button Pill */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full h-12 rounded-2xl bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Get Started"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-dashed border-slate-200 dark:border-slate-800"></div>
          </div>
          <span className="relative bg-white/90 dark:bg-slate-900/90 px-3 text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Or sign in with
          </span>
        </div>

        {/* Social Login Pills */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => { window.location.assign(`${API_BASE_URL}/auth/google`); }}
            aria-label="Sign in with Google"
            className="h-11 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-750 flex items-center justify-center transition-all"
          >
            <img src="/google.svg" alt="Google" className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => { window.location.assign(`${API_BASE_URL}/auth/github`); }}
            aria-label="Sign in with GitHub"
            className="h-11 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-750 flex items-center justify-center transition-all"
          >
            <img src="/github.svg" alt="GitHub" className="h-4 w-4" />
          </button>
        </div>

        {/* Switch to Register */}
        <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6">
          Don't have an account?{" "}
          <NavLink
            to="/auth/register"
            className="font-semibold text-slate-900 dark:text-white hover:underline ml-1"
          >
            Sign up for free
          </NavLink>
        </p>
      </div>
    </div>
  );
}
