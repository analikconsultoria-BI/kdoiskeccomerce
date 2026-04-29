"use client";

import * as React from "react";
import Link from "next/link";
import { Search, ShoppingCart, User, Menu, X, Battery, Ear, Archive } from "lucide-react";
import { SearchBar } from "../common/SearchBar";
import { useCart } from "@/context/CartContext";

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = React.useState(false);
  const [categories, setCategories] = React.useState<any[]>([]);
  const { itemCount } = useCart();

  React.useEffect(() => {
    fetch('/api/categorias', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          console.error("Dados de categorias inválidos:", data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="sticky top-0 z-50 flex flex-col">
      {/* ── Main Header ── */}
      <header className="bg-white/95 backdrop-blur-md border-b border-brand-100/30 shadow-sm relative overflow-hidden">
        <div className="max-w-7xl mx-auto h-16 md:h-[72px] px-4 md:px-8 flex items-center justify-between relative z-10">

          {/* Logo - Far Left */}
          <Link href="/" className="flex items-center group shrink-0">
            <span className="text-[22px] font-extrabold text-brand-700 tracking-tight leading-none group-hover:text-brand-600 transition-colors">
              KdoisK
            </span>
          </Link>

          {/* Search - Middle (Clean) */}
          <div className="hidden md:block flex-1 max-w-xl mx-12">
            <SearchBar variant="default" placeholder="O que você procura hoje?" />
          </div>

          {/* Right Icons - Far Right */}
          <div className="flex items-center gap-2 md:gap-4">
            <button
              className="md:hidden p-2 text-brand-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            >
              <Search className="w-5 h-5" />
            </button>

            <Link
              href="#"
              className="hidden sm:flex items-center gap-2.5 p-2 px-3 text-brand-600 hover:text-brand-800 hover:bg-brand-50 rounded-xl transition-all"
            >
              <User className="w-5 h-5" />
              <span className="hidden lg:block text-sm font-bold tracking-wide">Minha Conta</span>
            </Link>

            <Link
              href="/carrinho"
              className="p-2.5 text-brand-600 hover:text-brand-800 hover:bg-brand-50 rounded-xl transition-all relative group"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-accent-500 text-white text-[10px] font-black w-[18px] h-[18px] rounded-full flex items-center justify-center ring-2 ring-white shadow-sm">
                  {itemCount}
                </span>
              )}
            </Link>

            <button
              className="md:hidden p-2 text-brand-500 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Search Expand */}
        {isMobileSearchOpen && (
          <div className="md:hidden bg-white p-4 border-t border-brand-100">
            <SearchBar variant="default" placeholder="Buscar no site..." />
          </div>
        )}
      </header>

      {/* ── Category Bar (Soft Purple Tint) ── */}
      <div className="hidden md:block bg-brand-50/80 backdrop-blur-sm border-b border-brand-100/50 relative z-40 py-2.5">
        <nav className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-center gap-10">
          {categories.map((item) => (
            <Link
              key={item.id}
              href={item.link}
              className="flex items-center gap-2.5 py-1.5 text-[13px] font-bold text-brand-900/70 transition-all hover:text-brand-900 group"
            >
              <Archive className="w-4 h-4 text-brand-400 group-hover:text-brand-600" strokeWidth={2} />
              {item.nome}
            </Link>
          ))}

          <Link href="/loja?ofertas=true" className="text-[13px] font-black text-accent-600 hover:text-accent-700 transition-colors ml-4 uppercase tracking-widest inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse" /> Ofertas do Mês
          </Link>
        </nav>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-warm-900/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
          <div
            className="w-[85vw] max-w-sm h-full bg-white flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-brand-100 bg-brand-50/50">
              <span className="font-bold text-xl text-brand-900">KdoisK</span>
              <button
                className="p-1.5 rounded-lg bg-white shadow-sm border border-brand-100 text-warm-500"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex flex-col p-4 gap-1">
              {[
                { label: "Início", href: "/" },
                { label: "Produtos", href: "/loja" },
                { label: "Sobre", href: "/sobre" },
                { label: "Contato", href: "/contato" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="font-medium text-warm-800 p-4 hover:bg-brand-50 rounded-xl transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="h-px bg-brand-100 my-4" />
              <Link
                href="/carrinho"
                className="font-bold flex items-center justify-between text-accent-600 bg-accent-100/50 p-4 rounded-xl border border-accent-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Ver Carrinho
                <span className="bg-accent-500 text-white text-xs px-2.5 py-1 rounded-full">{itemCount} itens</span>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};
