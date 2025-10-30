import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-3xl bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 ring-1 ring-slate-200/70 shadow-xl p-10 text-center">
        <div className="flex flex-col items-center gap-4">
          <img src="/thriveLogo.svg" alt="Thrive Logo" className="w-24 h-24" />
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">Asset Management</h1>
          <p className="text-slate-600 max-w-md">A clean and focused workspace to manage your company assets efficiently.</p>
          <Link
            href="/login"
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white px-6 py-3 font-semibold shadow-[0_6px_20px_rgba(99,102,241,0.35)] transition-transform hover:translate-y-[1px]"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
