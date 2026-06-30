import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-500/25 mb-4">
            <span className="text-3xl font-bold text-white">Z</span>
          </div>
          <h1 className="text-2xl font-bold text-white">WhatsZap Mágico</h1>
          <p className="text-slate-400 text-sm mt-1">Faça login para continuar</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
