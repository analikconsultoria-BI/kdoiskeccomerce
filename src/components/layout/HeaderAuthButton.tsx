"use client"

import * as React from "react"
import Link from "next/link"
import { User, LogOut } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { logoutAction } from "@/app/actions/auth"

export function HeaderAuthButton() {
  const [user, setUser] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user)
      setLoading(false)
    })

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  if (loading) {
    return (
      <div className="hidden sm:flex items-center gap-2.5 p-2 px-3 text-brand-600 rounded-xl">
        <User className="w-5 h-5 animate-pulse" />
      </div>
    )
  }

  if (user) {
    return (
      <div className="relative group hidden sm:flex">
        <Link
          href="/minha-conta"
          className="flex items-center gap-2.5 p-2 px-3 text-brand-600 hover:text-brand-800 hover:bg-brand-50 rounded-xl transition-all"
        >
          <User className="w-5 h-5" />
          <span className="hidden lg:block text-sm font-bold tracking-wide">
            {user.user_metadata?.nome ? user.user_metadata.nome.split(' ')[0] : 'Minha Conta'}
          </span>
        </Link>

        {/* Dropdown menu */}
        <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-brand-100 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 py-2">
          <Link href="/minha-conta" className="block px-4 py-2 text-sm text-warm-700 hover:bg-brand-50 hover:text-brand-700 font-medium">
            Painel
          </Link>
          <Link href="/minha-conta/pedidos" className="block px-4 py-2 text-sm text-warm-700 hover:bg-brand-50 hover:text-brand-700 font-medium">
            Meus Pedidos
          </Link>
          <hr className="my-1 border-brand-100" />
          <button 
            onClick={async () => { await logoutAction() }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-bold flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Sair
          </button>
        </div>
      </div>
    )
  }

  return (
    <Link
      href="/entrar"
      className="hidden sm:flex items-center gap-2.5 p-2 px-3 text-brand-600 hover:text-brand-800 hover:bg-brand-50 rounded-xl transition-all"
    >
      <User className="w-5 h-5" />
      <span className="hidden lg:block text-sm font-bold tracking-wide">Entrar</span>
    </Link>
  )
}
