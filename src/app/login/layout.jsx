const metadata = {
  title: "Sign in",
};

const LoginLayout = ({ children }) => {
  return (
    <section className="min-h-screen grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] bg-slate-50">
      <div className="flex items-center justify-center p-12 bg-gradient-to-br from-indigo-50 to-indigo-100 border-r border-slate-200">
        <div className="w-full max-w-[420px] flex flex-col gap-12 items-center">
            <img src="/thriveLogo.svg" alt="Thrive Logo" className="max-w-[70%] max-h-48" />
          <h1 className="text-slate-800 text-4xl">Welcome back</h1>
          <p className="text-slate-500 leading-relaxed text-lg text-center">
            Sign in to continue managing your assets with an elegant, focused workspace.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center py-12 px-8">
        <div className="w-full max-w-[440px]">{children}</div>
      </div>
    </section>
  );
}

export default LoginLayout;


