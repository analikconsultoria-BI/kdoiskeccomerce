import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Recuperar Senha | KdoisK',
}

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-brand-50/30">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-brand-100">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-warm-900 tracking-tight">
            Recuperar Senha
          </h1>
          <p className="mt-2 text-sm text-warm-600">
            Digite seu email para receber um link de redefinição
          </p>
        </div>
        
        <ForgotPasswordForm />

        <div className="text-center mt-4">
          <Link href="/entrar" className="text-brand-600 font-bold hover:text-brand-800 text-sm">
            Voltar para o Login
          </Link>
        </div>
      </div>
    </main>
  )
}
