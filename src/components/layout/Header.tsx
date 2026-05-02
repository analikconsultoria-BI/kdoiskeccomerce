"use client";

import * as React from "react";
import Link from "next/link";

import {

  ShoppingCart,
  User,
  Menu,
  X,
  Heart,
  Package,
  ChevronDown,
  Tag,
  Ticket,
  Phone,
  Store,
  ChevronRight,
  LogOut,
  LayoutDashboard,

} from "lucide-react";
import { SearchBar } from "../common/SearchBar";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";
import { logoutAction } from "@/app/actions/auth";

export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [categories, setCategories] = React.useState<any[]>([]);
  const [catDropdownOpen, setCatDropdownOpen] = React.useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const { itemCount } = useCart();
  const catDropdownRef = React.useRef<HTMLDivElement>(null);
  const userDropdownRef = React.useRef<HTMLDivElement>(null);
  const catTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const userTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);


  React.useEffect(() => {
    fetch("/api/categorias", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(console.error);
  }, []);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_, session) => setUser(session?.user ?? null)
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  // Lock body scroll when drawer is open
  React.useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isDrawerOpen]);

  const handleCatEnter = () => {
    if (catTimeoutRef.current) clearTimeout(catTimeoutRef.current);
    setCatDropdownOpen(true);
  };
  const handleCatLeave = () => {
    catTimeoutRef.current = setTimeout(() => setCatDropdownOpen(false), 200);
  };
  const handleUserEnter = () => {
    if (userTimeoutRef.current) clearTimeout(userTimeoutRef.current);
    setUserDropdownOpen(true);
  };
  const handleUserLeave = () => {
    userTimeoutRef.current = setTimeout(() => setUserDropdownOpen(false), 200);
  };

  const handleLogout = async () => {
    await logoutAction();
    window.location.href = "/";
  };

  const userName = user?.user_metadata?.nome || user?.user_metadata?.full_name || user?.email;
  const firstName = userName ? userName.split(" ")[0] : null;

  return (
    <>
      <div className="sticky top-0 z-50 flex flex-col">
        {/* ══════════════════════════════════════════════════════
            DESKTOP HEADER — Two-Line Mercado Livre Style
        ══════════════════════════════════════════════════════ */}

        {/* ── Line 1: Logo + Centered Search ── */}
        <header className="hidden md:block bg-brand-600 relative">
          <div className="max-w-7xl mx-auto h-16 px-6 flex items-center">
            {/* Logo Left */}
            <div className="w-48 shrink-0">
              <Link href="/" className="flex items-center group">
                <span className="text-2xl font-black text-white tracking-tight group-hover:opacity-90 transition-opacity">
                  KdoisK
                </span>
              </Link>
            </div>

            {/* Centered Search Bar */}
            <div className="flex-1 flex justify-center">
              <div className="w-full max-w-2xl">
                <SearchBar variant="default" placeholder="Buscar produtos, marcas e muito mais..." />
              </div>
            </div>

            {/* Balance Div (Same width as Logo area to force true centering) */}
            <div className="w-48 shrink-0" aria-hidden="true" />
          </div>
        </header>

        {/* ── Line 2: Navigation + Account Actions ── */}
        <nav className="hidden md:block bg-brand-700 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-10">
            {/* Left: Nav Links (Centralizado-esquerda) */}
            <div className="flex items-center gap-1">
              {/* Categorias Dropdown */}
              <div
                ref={catDropdownRef}
                className="relative"
                onMouseEnter={handleCatEnter}
                onMouseLeave={handleCatLeave}
              >
                <button className="flex items-center gap-1.5 px-3 py-2 text-white/90 hover:text-white text-[13px] font-semibold rounded-lg hover:bg-white/10 transition-all">
                  <Store className="w-4 h-4" />
                  Categorias
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${catDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {catDropdownOpen && (
                  <div className="absolute top-full left-0 mt-0 w-64 bg-white rounded-xl shadow-2xl shadow-black/15 border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <p className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Todas as categorias</p>
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={cat.link}
                        className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-700 font-medium transition-colors group"
                      >
                        {cat.nome}
                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-brand-500" />
                      </Link>
                    ))}
                    <hr className="my-1 border-gray-100" />
                    <Link href="/loja" className="flex items-center px-4 py-2.5 text-sm text-brand-600 hover:bg-brand-50 font-bold transition-colors">
                      Ver todos os produtos
                    </Link>
                  </div>
                )}
              </div>

              <Link href="/loja?ofertas=true" className="flex items-center gap-1.5 px-3 py-2 text-white/90 hover:text-white text-[13px] font-semibold rounded-lg hover:bg-white/10 transition-all">
                <Tag className="w-4 h-4" />
                Ofertas
              </Link>
              <Link href="/cupons" className="flex items-center gap-1.5 px-3 py-2 text-white/90 hover:text-white text-[13px] font-semibold rounded-lg hover:bg-white/10 transition-all">
                <Ticket className="w-4 h-4" />
                Cupons
              </Link>
              <Link href="/contato" className="flex items-center gap-1.5 px-3 py-2 text-white/90 hover:text-white text-[13px] font-semibold rounded-lg hover:bg-white/10 transition-all">
                <Phone className="w-4 h-4" />
                Contato
              </Link>
            </div>

            {/* Right: Account Actions (Mais à direita) */}
            <div className="flex items-center gap-1">
              {/* User / Login */}
              <div
                ref={userDropdownRef}
                className="relative"
                onMouseEnter={handleUserEnter}
                onMouseLeave={handleUserLeave}
              >
                {loading ? (
                  <div className="p-2 px-3">
                    <User className="w-5 h-5 text-white/50 animate-pulse" />
                  </div>
                ) : user ? (
                  <button className="flex items-center gap-2 py-2 px-3 text-white/90 hover:text-white rounded-lg hover:bg-white/10 transition-all text-sm">
                    <User className="w-5 h-5" />
                    <span className="font-semibold max-w-[100px] truncate">{firstName}</span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                  </button>
                ) : (
                  <Link
                    href="/entrar"
                    className="flex items-center gap-2 py-2 px-3 text-white/90 hover:text-white rounded-lg hover:bg-white/10 transition-all text-sm"
                  >
                    <User className="w-5 h-5" />
                    <span className="font-semibold">Entrar</span>
                  </Link>
                )}

                {/* User Dropdown */}
                {userDropdownOpen && user && (
                  <div className="absolute top-full right-0 mt-1 w-56 bg-white rounded-xl shadow-2xl shadow-black/15 border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-bold text-gray-900 text-sm truncate">{userName}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                    <Link href="/minha-conta" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-700 font-medium transition-colors">
                      <LayoutDashboard className="w-4 h-4" /> Minha Conta
                    </Link>
                    <Link href="/minha-conta/pedidos" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-700 font-medium transition-colors">
                      <Package className="w-4 h-4" /> Meus Pedidos
                    </Link>
                    <Link href="/minha-conta/desejos" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-700 font-medium transition-colors">
                      <Heart className="w-4 h-4" /> Lista de Desejos
                    </Link>
                    <hr className="my-1.5 border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-semibold transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sair
                    </button>
                  </div>
                )}
              </div>

              {/* Compras */}
              <Link
                href={user ? "/minha-conta/pedidos" : "/entrar"}
                className="flex items-center gap-2 py-2 px-3 text-white/90 hover:text-white rounded-lg hover:bg-white/10 transition-all text-sm"
              >
                <Package className="w-5 h-5" />
                <span className="hidden lg:block font-semibold">Compras</span>
              </Link>

              {/* Favoritos */}
              <Link
                href={user ? "/minha-conta/desejos" : "/entrar"}
                className="flex items-center gap-2 py-2 px-3 text-white/90 hover:text-white rounded-lg hover:bg-white/10 transition-all text-sm"
              >
                <Heart className="w-5 h-5" />
                <span className="hidden lg:block font-semibold">Favoritos</span>
              </Link>

              {/* Cart */}
              <Link
                href="/carrinho"
                className="flex items-center gap-2 py-2 px-3 text-white/90 hover:text-white rounded-lg hover:bg-white/10 transition-all text-sm relative"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute top-0.5 left-6 bg-accent-500 text-white text-[10px] font-black w-[18px] h-[18px] rounded-full flex items-center justify-center ring-2 ring-brand-600">
                    {itemCount}
                  </span>
                )}
                <span className="hidden lg:block font-semibold">Carrinho</span>
              </Link>
            </div>
          </div>
        </nav>

        {/* ══════════════════════════════════════════════════════
            MOBILE HEADER — Single line
        ══════════════════════════════════════════════════════ */}
        <header className="md:hidden bg-brand-600 relative z-50">
          <div className="h-14 px-4 flex items-center justify-between">
            {/* Hamburger */}
            <button
              className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Abrir menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo Center */}
            <Link href="/" className="absolute left-1/2 -translate-x-1/2">
              <span className="text-xl font-black text-white tracking-tight">KdoisK</span>
            </Link>

            {/* Cart Right */}
            <Link href="/carrinho" className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors relative">
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-accent-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-brand-600">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Search below header */}
          <div className="px-3 pb-3">
            <SearchBar variant="default" placeholder="Buscar no KdoisK..." />
          </div>
        </header>
      </div>

      {/* ══════════════════════════════════════════════════════
          MOBILE DRAWER — Slides from left
      ══════════════════════════════════════════════════════ */}

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-60 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isDrawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 z-70 h-full w-[85vw] max-w-xs bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header / Profile */}
        <div className="bg-brand-600 p-5 pb-6">
          <div className="flex items-center justify-between mb-5">
            <span className="text-lg font-black text-white">KdoisK</span>
            <button
              className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setIsDrawerOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {user ? (
            <Link href="/minha-conta" onClick={() => setIsDrawerOpen(false)} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
                {firstName?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="overflow-hidden">
                <p className="text-white font-bold text-sm truncate">{firstName || "Minha Conta"}</p>
                <p className="text-white/60 text-xs truncate">{user.email}</p>
              </div>
            </Link>
          ) : (
            <Link
              href="/entrar"
              onClick={() => setIsDrawerOpen(false)}
              className="flex items-center gap-3 bg-white/10 rounded-xl p-3 hover:bg-white/15 transition-colors"
            >
              <User className="w-5 h-5 text-white" />
              <div>
                <p className="text-white font-bold text-sm">Entre ou cadastre-se</p>
                <p className="text-white/60 text-xs">Para ver ofertas exclusivas</p>
              </div>
            </Link>
          )}
        </div>

        {/* Drawer Navigation */}
        <div className="flex-1 overflow-y-auto">
          {/* Quick Links */}
          <div className="py-3 px-2">
            {user && (
              <>
                <DrawerLink href="/minha-conta" icon={LayoutDashboard} label="Minha Conta" onClose={() => setIsDrawerOpen(false)} />
                <DrawerLink href="/minha-conta/pedidos" icon={Package} label="Meus Pedidos" onClose={() => setIsDrawerOpen(false)} />
                <DrawerLink href="/minha-conta/desejos" icon={Heart} label="Lista de Desejos" onClose={() => setIsDrawerOpen(false)} />
                <div className="h-px bg-gray-100 mx-3 my-2" />
              </>
            )}
            <DrawerLink href="/loja" icon={Store} label="Loja" onClose={() => setIsDrawerOpen(false)} />
            <DrawerLink href="/loja?ofertas=true" icon={Tag} label="Ofertas" onClose={() => setIsDrawerOpen(false)} />
            <DrawerLink href="/cupons" icon={Ticket} label="Cupons" onClose={() => setIsDrawerOpen(false)} />
            <DrawerLink href="/contato" icon={Phone} label="Contato" onClose={() => setIsDrawerOpen(false)} />
          </div>

          {/* Categories Section */}
          <div className="border-t border-gray-100 py-3 px-2">
            <p className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Categorias</p>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={cat.link}
                onClick={() => setIsDrawerOpen(false)}
                className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-700 font-medium rounded-lg transition-colors"
              >
                {cat.nome}
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </Link>
            ))}
          </div>
        </div>

        {/* Drawer Footer */}
        {user && (
          <div className="border-t border-gray-100 p-3">
            <button
              onClick={async () => { setIsDrawerOpen(false); await handleLogout(); }}
              className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-semibold rounded-lg transition-colors w-full"
            >
              <LogOut className="w-4 h-4" /> Sair da conta
            </button>
          </div>
        )}
      </div>
    </>
  );
};

/* ── Drawer Link Component ── */
function DrawerLink({ href, icon: Icon, label, onClose }: { href: string; icon: any; label: string; onClose: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-700 font-medium rounded-lg transition-colors"
    >
      <Icon className="w-5 h-5 text-gray-400" />
      {label}
    </Link>
  );
}
