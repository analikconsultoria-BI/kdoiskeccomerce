import { LoginForm } from '@/components/auth/LoginForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Entrar | KdoisK',
  description: 'Faça login na sua conta para acessar seus pedidos e dados.',
}

export default function LoginPage() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-brand-50/30">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-brand-100">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-warm-900 tracking-tight">
            Bem-vindo de volta
          </h1>
          <p className="mt-2 text-sm text-warm-600">
            Acesse sua conta para continuar
          </p>
        </div>
        
        <LoginForm />
      </div>
    </main>
  )
}
