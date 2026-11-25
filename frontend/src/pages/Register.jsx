import React, { useState } from "react";
import { User, Mail, Lock, GraduationCap, AtSign, UserPlus, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/services/api";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    userName: "",
    email: "",
    college: "",
    branch: "",
    graduationYear: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const oauthError = new URLSearchParams(location.search).get('oauth');
  const visibleError = error || (oauthError?.endsWith('-unconfigured')
    ? `Sign-up provider is not configured on this server (${oauthError.split('-')[0]}). Use email sign-up or add the provider credentials to backend/.env.`
    : oauthError ? 'Sign-up with that provider failed. Please try again or use email sign-up.' : '');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.userName || !formData.email || !formData.password) {
      setError("Please fill in all required fields (Name, Username, Email, Password).");
      return;
    }

    if (formData.password.length < 6 || new TextEncoder().encode(formData.password).length > 72) {
      setError("Password must be at least 6 characters and no more than 72 UTF-8 bytes.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);
      await register({
        name: formData.name,
        userName: formData.userName,
        email: formData.email,
        college: formData.college,
        branch: formData.branch,
        graduationYear: formData.graduationYear ? Number(formData.graduationYear) : undefined,
        password: formData.password
      });
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-[url('/loginLight.jpg')] dark:bg-[url('/starsDark.jpg')] bg-cover bg-center p-4 py-8">
      <div className="w-full max-w-[480px] rounded-[36px] bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl p-8 sm:p-9 shadow-2xl border border-white/60 dark:border-white/10 transition-all">
        {/* Floating Icon */}
        <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 shadow-md border border-slate-100 dark:border-slate-700/60 flex items-center justify-center mx-auto mb-5 text-slate-800 dark:text-slate-100">
          <UserPlus className="h-6 w-6 stroke-[2.2]" />
        </div>

        <div className="text-center space-y-1.5 mb-6">
          <h1 className="text-2xl sm:text-[1.7rem] font-bold tracking-tight text-slate-900 dark:text-white">
            Create Dev Account
          </h1>
          <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400">
            Join TrackPort to organize your personal projects and technical goals.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 mb-5">
          <button
            type="button"
            onClick={() => window.location.assign(`${API_BASE_URL}/auth/google?mode=signup`)}
            aria-label="Sign up with Google"
            className="h-11 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-750 flex items-center justify-center gap-2 transition-all text-xs font-medium text-slate-700 dark:text-slate-200"
          >
            <img src="/google.svg" alt="" className="h-4 w-4" />
            Google
          </button>
          <button
            type="button"
            onClick={() => window.location.assign(`${API_BASE_URL}/auth/github?mode=signup`)}
            aria-label="Sign up with GitHub"
            className="h-11 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-750 flex items-center justify-center gap-2 transition-all text-xs font-medium text-slate-700 dark:text-slate-200"
          >
            <img src="/github.svg" alt="" className="h-4 w-4" />
            GitHub
          </button>
        </div>

        <div className="relative mb-5 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-dashed border-slate-200 dark:border-slate-800" /></div>
          <span className="relative bg-white/90 dark:bg-slate-900/90 px-3 text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Or create an account with email</span>
        </div>

        {visibleError && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="font-medium">{visibleError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="h-11 rounded-2xl bg-slate-100/80 dark:bg-slate-800/70 px-3.5 flex items-center gap-2.5 border border-transparent focus-within:border-slate-300 dark:focus-within:border-slate-600 focus-within:bg-white dark:focus-within:bg-slate-800 transition-all">
              <User className="h-4 w-4 text-slate-400 shrink-0" />
              <input
                id="name"
                required
                type="text"
                placeholder="Full Name *"
                value={formData.name}
                onChange={handleChange}
                className="bg-transparent outline-none w-full text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
              />
            </div>

            <div className="h-11 rounded-2xl bg-slate-100/80 dark:bg-slate-800/70 px-3.5 flex items-center gap-2.5 border border-transparent focus-within:border-slate-300 dark:focus-within:border-slate-600 focus-within:bg-white dark:focus-within:bg-slate-800 transition-all">
              <AtSign className="h-4 w-4 text-slate-400 shrink-0" />
              <input
                id="userName"
                required
                minLength={3}
                maxLength={30}
                pattern="[A-Za-z0-9_]{3,30}"
                type="text"
                placeholder="Username *"
                value={formData.userName}
                onChange={handleChange}
                className="bg-transparent outline-none w-full text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="h-11 rounded-2xl bg-slate-100/80 dark:bg-slate-800/70 px-3.5 flex items-center gap-2.5 border border-transparent focus-within:border-slate-300 dark:focus-within:border-slate-600 focus-within:bg-white dark:focus-within:bg-slate-800 transition-all">
            <Mail className="h-4 w-4 text-slate-400 shrink-0" />
            <input
              id="email"
              required
              type="email"
              placeholder="Email Address *"
              value={formData.email}
              onChange={handleChange}
              className="bg-transparent outline-none w-full text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>

          <div className="h-11 rounded-2xl bg-slate-100/80 dark:bg-slate-800/70 px-3.5 flex items-center gap-2.5 border border-transparent focus-within:border-slate-300 dark:focus-within:border-slate-600 focus-within:bg-white dark:focus-within:bg-slate-800 transition-all">
            <GraduationCap className="h-4 w-4 text-slate-400 shrink-0" />
            <input
              id="college"
              type="text"
              placeholder="College / University"
              value={formData.college}
              onChange={handleChange}
              className="bg-transparent outline-none w-full text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              id="branch"
              type="text"
              placeholder="Branch (e.g. CSE)"
              value={formData.branch}
              onChange={handleChange}
              className="h-11 rounded-2xl bg-slate-100/80 dark:bg-slate-800/70 px-3.5 border border-transparent focus:border-slate-300 dark:focus:border-slate-600 bg-transparent outline-none text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
            />
            <input
              id="graduationYear"
              type="number"
              placeholder="Grad Year (e.g. 2026)"
              value={formData.graduationYear}
              onChange={handleChange}
              className="h-11 rounded-2xl bg-slate-100/80 dark:bg-slate-800/70 px-3.5 border border-transparent focus:border-slate-300 dark:focus:border-slate-600 bg-transparent outline-none text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="h-11 rounded-2xl bg-slate-100/80 dark:bg-slate-800/70 px-3.5 flex items-center gap-2 border border-transparent focus-within:border-slate-300 dark:focus-within:border-slate-600 focus-within:bg-white dark:focus-within:bg-slate-800 transition-all">
              <Lock className="h-4 w-4 text-slate-400 shrink-0" />
              <input
                id="password"
                required
                type={showPassword ? "text" : "password"}
                placeholder="Password *"
                value={formData.password}
                onChange={handleChange}
                className="bg-transparent outline-none w-full text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
              />
            </div>

            <div className="h-11 rounded-2xl bg-slate-100/80 dark:bg-slate-800/70 px-3.5 flex items-center gap-2 border border-transparent focus-within:border-slate-300 dark:focus-within:border-slate-600 focus-within:bg-white dark:focus-within:bg-slate-800 transition-all">
              <Lock className="h-4 w-4 text-slate-400 shrink-0" />
              <input
                id="confirmPassword"
                required
                type={showPassword ? "text" : "password"}
                placeholder="Confirm *"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="bg-transparent outline-none w-full text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full h-12 rounded-2xl bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2 mt-4 disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Get Started"
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-5">
          Already have an account?{" "}
          <NavLink to="/auth/login" className="font-semibold text-slate-900 dark:text-white hover:underline ml-1">
            Sign In
          </NavLink>
        </p>
      </div>
    </div>
  );
}
