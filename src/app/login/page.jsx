"use client";

import { useState } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => setIsSubmitting(false), 800);
  }

  return (
    <div className="bg-white rounded-2xl shadow-[0_1px_0_rgba(0,0,0,0.04),0_8px_24px_rgba(2,6,23,0.06),0_16px_48px_rgba(2,6,23,0.04)] p-7">
      <div className="flex flex-col gap-2">
        <h2 className="m-0 text-slate-900 text-[22px]">Sign in</h2>
        <p className="m-0 text-slate-500">Enter your credentials to access your dashboard</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 grid gap-3.5">
        <label className="grid gap-2">
          <span className="text-slate-700 font-semibold">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="appearance-none w-full px-3.5 py-3 rounded-xl border border-slate-200 outline-none bg-slate-50 text-slate-900 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-slate-700 font-semibold">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="appearance-none w-full px-3.5 py-3 rounded-xl border border-slate-200 outline-none bg-slate-50 text-slate-900 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`mt-1 text-white border-0 px-4 py-3 rounded-xl font-bold tracking-wide shadow-[0_6px_20px_rgba(99,102,241,0.35)] transition-transform ${
            isSubmitting ? "bg-gradient-to-br from-slate-400 to-indigo-300 cursor-not-allowed" : "bg-gradient-to-br from-indigo-500 to-violet-500 hover:translate-y-[1px]"
          }`}
        >
          {isSubmitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;


