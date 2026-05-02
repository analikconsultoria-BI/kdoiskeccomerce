import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Package, MapPin, User, Heart, ShieldCheck, ChevronRight } from 'lucide-react'

export const metadata = {
  title: 'Minha Conta | KdoisK',
}

export default async function MinhaContaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/entrar')
  }

  const { data: perfil } = await supabase
    .from('perfis')
    .select('nome')
    .eq('id', user.id)
    .single()

  const displayName = perfil?.nome || user.user_metadata?.full_name || user.email

  const quickLinks = [
    {
      href: "/minha-conta/pedidos",
      icon: Package,
      title: "Meus Pedidos",
      description: "Acompanhe entregas e veja o histórico de compras",
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      href: "/minha-conta/enderecos",
      icon: MapPin,
      title: "Endereços",
      description: "Gerencie seus endereços de entrega",
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      href: "/minha-conta/dados",
      icon: User,
      title: "Meus Dados",
      description: "Edite informações pessoais e senha",
      color: "bg-amber-50 text-amber-600 border-amber-100",
    },
    {
      href: "/minha-conta/desejos",
      icon: Heart,
      title: "Lista de Desejos",
      description: "Produtos que você salvou para comprar depois",
      color: "bg-rose-50 text-rose-600 border-rose-100",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
          Olá, {displayName}!
        </h1>
        <p className="text-gray-500 text-sm">
          Bem-vindo ao seu painel. Gerencie pedidos, endereços e dados pessoais.
        </p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickLinks.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4 hover:shadow-md hover:border-gray-300 transition-all group"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${item.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 text-sm">{item.title}</h3>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-brand-600 transition-colors" />
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Security Notice */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-green-600 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Sua conta está protegida</p>
          <p className="text-xs text-gray-500">Dados criptografados e sessão segura ativa.</p>
        </div>
      </div>
    </div>
  )
}
