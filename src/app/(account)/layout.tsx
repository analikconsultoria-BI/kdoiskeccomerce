"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  MapPin,
  User,
  Heart,
  LogOut,
  ShoppingCart,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
} from "lucide-react"
import { logoutAction } from "@/app/actions/auth"
import { supabase } from "@/lib/supabase"

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [user, setUser] = React.useState<any>(null)
  const [profile, setProfile] = React.useState<any>(null)

  React.useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        const { data } = await supabase
          .from('perfis')
          .select('*')
          .eq('id', user.id)
          .single()
        setProfile(data)
      }
    }
    loadUser()
  }, [])

  const handleLogout = async () => {
    await logoutAction()
    window.location.href = '/'
  }

  const menuItems = [
    { href: "/minha-conta", label: "Visão Geral", icon: LayoutDashboard, description: "Resumo da sua conta" },
    { href: "/minha-conta/pedidos", label: "Meus Pedidos", icon: Package, description: "Acompanhe suas compras" },
    { href: "/minha-conta/enderecos", label: "Endereços", icon: MapPin, description: "Gerencie endereços de entrega" },
    { href: "/minha-conta/dados", label: "Meus Dados", icon: User, description: "Informações pessoais e segurança" },
    { href: "/minha-conta/desejos", label: "Lista de Desejos", icon: Heart, description: "Produtos que você salvou" },
  ]

  const userName = profile?.nome || user?.user_metadata?.nome || user?.user_metadata?.full_name || user?.email || "Cliente"
  const userInitial = userName.charAt(0).toUpperCase()

  // Find current page title
  const currentPage = menuItems.find(item => item.href === pathname)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ── Header ── */}
      <header className="bg-brand-600 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto h-14 px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="shrink-0">
              <span className="text-xl font-black text-white tracking-tight">KdoisK</span>
            </Link>
            <span className="hidden sm:block text-white/40 text-sm">|</span>
            <span className="hidden sm:block text-white/80 text-sm font-semibold">Minha Conta</span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/loja" className="hidden sm:flex items-center gap-1.5 text-white/80 hover:text-white text-sm font-semibold transition-colors">
              <ChevronLeft className="w-4 h-4" />
              Voltar à loja
            </Link>
            <Link href="/carrinho" className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors relative">
              <ShoppingCart className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Mobile Navigation — Scrollable tabs ── */}
      <nav className="md:hidden bg-white border-b border-gray-200 overflow-x-auto">
        <div className="flex">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 shrink-0 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                  isActive
                    ? 'border-brand-600 text-brand-700 bg-brand-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label.split(' ').pop()}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* ── Main Content Area ── */}
      <div className="max-w-7xl mx-auto w-full flex-1 px-4 md:px-6 py-6 md:py-10">
        <div className="flex gap-8">

          {/* ── Desktop Sidebar ── */}
          <aside className="hidden md:block w-72 shrink-0">
            {/* Profile Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {userInitial}
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-gray-900 text-sm truncate">{userName}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {menuItems.map((item, index) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-colors border-l-[3px] ${
                      isActive
                        ? 'border-brand-600 bg-brand-50 text-brand-700 font-semibold'
                        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } ${index > 0 ? 'border-t border-t-gray-100' : ''}`}
                  >
                    <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-brand-600' : 'text-gray-400'}`} />
                    {item.label}
                  </Link>
                )
              })}

              {/* Separator + Logout */}
              <div className="border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors border-l-[3px] border-transparent"
                >
                  <LogOut className="w-4.5 h-4.5" />
                  Sair da conta
                </button>
              </div>
            </div>

            {/* Security Badge */}
            <div className="mt-4 flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
              <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
              <p className="text-[11px] font-semibold text-green-700">Seus dados estão protegidos com criptografia AES-256</p>
            </div>
          </aside>

          {/* ── Content ── */}
          <main className="flex-1 min-w-0">
            {/* Breadcrumb */}
            {currentPage && (
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-400 mb-6">
                <Link href="/minha-conta" className="hover:text-brand-600 transition-colors">Minha Conta</Link>
                {currentPage.href !== "/minha-conta" && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span className="text-gray-700 font-medium">{currentPage.label}</span>
                  </>
                )}
              </div>
            )}

            {/* Mobile: Return link */}
            <Link href="/loja" className="sm:hidden flex items-center gap-1.5 text-brand-600 text-sm font-semibold mb-4">
              <ChevronLeft className="w-4 h-4" />
              Voltar à loja
            </Link>

            {children}
          </main>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} KdoisK — Todos os direitos reservados.</p>
          <div className="flex gap-6 text-xs text-gray-400">
            <Link href="/ajuda" className="hover:text-brand-600 transition-colors">Ajuda</Link>
            <Link href="/termos" className="hover:text-brand-600 transition-colors">Termos</Link>
            <Link href="/privacidade" className="hover:text-brand-600 transition-colors">Privacidade</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
