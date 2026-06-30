import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="w-full max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-500/25 mb-4">
          <span className="text-3xl font-bold text-white">Z</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Criar Conta</h1>
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 mt-6">
          <p className="text-slate-600 text-sm">
            Crie sua conta e comece a automatizar seu WhatsApp em minutos.
          </p>
          <Link
            href="/login"
            className="block w-full bg-emerald-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-emerald-700 transition text-center"
          >
            Fazer login com Google
          </Link>
          <p className="text-xs text-slate-400">
            Ao criar uma conta, você aceita nossos{" "}
            <a href="#" className="text-emerald-600 hover:underline">Termos de Uso</a> e{" "}
            <a href="#" className="text-emerald-600 hover:underline">Política de Privacidade</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
