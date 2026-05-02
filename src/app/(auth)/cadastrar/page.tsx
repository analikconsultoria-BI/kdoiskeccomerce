import { RegisterForm } from '@/components/auth/RegisterForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Criar Conta | KdoisK',
  description: 'Crie sua conta para aproveitar nossas ofertas exclusivas.',
}

export default function RegisterPage() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-brand-50/30">
      <div className="max-w-2xl w-full space-y-8 bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-brand-100">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-extrabold text-warm-900 tracking-tight">
            Crie sua conta
          </h1>
          <p className="mt-2 text-sm text-warm-600">
            Preencha seus dados para começar a comprar
          </p>
        </div>
        
        <RegisterForm />
      </div>
    </main>
  )
}
