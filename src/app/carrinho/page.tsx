"use client";

import * as React from "react";
import Link from "next/link";
import { X, Minus, Plus, Truck, ShieldCheck, ArrowRight } from "lucide-react";
import { mockProducts } from "@/lib/mockData";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function Carrinho() {
  // Mock items utilizando a base de dados determinística
  const cartItems = mockProducts.slice(0, 3).map((p) => ({
    product: p,
    quantity: 1,
  }));

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const freight = 19.90;
  const discount = subtotal * 0.05;
  const total = subtotal + freight;

  return (
    <div className="bg-warm-50 min-h-screen py-12 md:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header do Carrinho */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 md:mb-12">
          <div>
            <nav className="flex items-center gap-2 text-xs font-bold text-warm-400 uppercase tracking-widest mb-3">
              <Link href="/loja" className="hover:text-brand-600 transition-colors">Loja</Link>
              <span>/</span>
              <span className="text-brand-900">Meu Carrinho</span>
            </nav>
            <h1 className="text-3xl md:text-5xl font-extrabold text-brand-900 tracking-tight leading-none">
              Seu Carrinho
              <span className="text-brand-300 ml-4 font-normal text-2xl md:text-3xl">({cartItems.length})</span>
            </h1>
          </div>
          <Link href="/loja" className="text-brand-700 font-bold text-sm hover:underline underline-offset-8 transition-all hidden md:block">
            CONTINUAR COMPRANDO
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
          
          {/* Listagem de Produtos */}
          <div className="space-y-4">
            {cartItems.map((item) => (
              <Card key={item.product.id} className="p-0 overflow-hidden border-brand-100/50">
                <div className="flex flex-col sm:flex-row items-center p-5 gap-6">
                  {/* Imagem com gradiente de fundo */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-linear-to-br from-brand-100 to-brand-50 flex items-center justify-center shrink-0 border border-brand-100/20">
                    <img 
                      src={item.product.images[0] || "https://placehold.co/600x400/f3f4f6/666666?text=Imagem+Indisponivel"} 
                      alt={item.product.name}
                      className="w-16 h-16 object-contain mix-blend-multiply opacity-80" 
                    />
                  </div>

                  {/* Detalhes */}
                  <div className="flex-1 w-full text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-4">
                      <div>
                        <Link href={`/produto/${item.product.slug}`} className="text-lg font-bold text-brand-900 hover:text-brand-700 transition-colors block leading-tight">
                          {item.product.name}
                        </Link>
                        <span className="text-[11px] font-bold text-warm-400 uppercase tracking-wider mt-1 block">
                          Marca: {item.product.specifications["Marca"]}
                        </span>
                      </div>
                      <span className="text-xl font-black text-brand-900">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.product.price)}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-center sm:justify-between gap-4 mt-auto">
                      {/* Seletor de Qtd Premium */}
                      <div className="flex items-center bg-warm-100 rounded-full p-1 border border-warm-200/50">
                        <button className="w-8 h-8 flex items-center justify-center text-brand-700 hover:bg-white rounded-full transition-all shadow-sm active:scale-95">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-bold text-brand-900 text-sm">
                          {item.quantity}
                        </span>
                        <button className="w-8 h-8 flex items-center justify-center text-brand-700 hover:bg-white rounded-full transition-all shadow-sm active:scale-95">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button className="flex items-center gap-2 text-xs font-bold text-error/70 hover:text-error transition-colors uppercase tracking-widest p-2">
                        <X className="w-4 h-4" /> Remover
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {/* Banner de Frete Grátis Mock */}
            <div className="bg-brand-900 rounded-2xl p-6 text-white flex items-center justify-between gap-6 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/10 transition-colors pointer-events-none" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                  <Truck className="w-6 h-6 text-accent-400" />
                </div>
                <div>
                  <h4 className="font-bold text-lg leading-tight uppercase tracking-tight">Faltam R$ 120,10</h4>
                  <p className="text-xs text-brand-300 font-medium">Para você ganhar frete grátis em toda a loja!</p>
                </div>
              </div>
              <div className="w-24 h-2 bg-white/10 rounded-full hidden md:block overflow-hidden relative">
                <div className="absolute top-0 left-0 h-full w-[60%] bg-accent-500 rounded-full" />
              </div>
            </div>
          </div>

          {/* Checkout Summary */}
          <aside className="sticky top-28 space-y-6">
            <Card className="p-8 border-brand-100/40 shadow-(--shadow-elevated) bg-warm-white">
              <h2 className="text-xl font-bold text-brand-900 mb-8 flex items-center gap-2">
                Resumo do Pedido
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm text-warm-500 font-medium">
                  <span>Subtotal</span>
                  <span className="text-brand-900 font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-warm-500 font-medium">
                  <span>Frete fixo</span>
                  <span className="text-brand-900 font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(freight)}</span>
                </div>
                <div className="flex justify-between text-sm text-success font-bold">
                  <span>Desconto Pix (5%)</span>
                  <span>-{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(discount)}</span>
                </div>
              </div>

              <div className="divider-fade mb-8 opacity-50" />

              <div className="flex items-end justify-between mb-8">
                <span className="text-xs font-black text-warm-400 uppercase tracking-widest mb-1">Total final</span>
                <div className="text-right">
                  <div className="text-3xl font-black text-brand-900 leading-none">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
                  </div>
                  <span className="text-[10px] font-bold text-warm-400 block mt-2 uppercase tracking-wide">
                    ou {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total - discount)} à vista no PIX
                  </span>
                </div>
              </div>

              <Link href="/checkout">
                <Button size="lg" fullWidth className="h-14 text-sm font-black tracking-widest">
                  FINALIZAR COMPRA <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>

              {/* Botão para Calcule Frete - Mock */}
              <div className="mt-8 pt-8 border-t border-brand-50 text-center">
                <div className="flex items-center justify-center gap-2 text-[10px] font-black text-warm-400 uppercase tracking-widest mb-4">
                  <ShieldCheck className="w-3.5 h-3.5 text-success" /> Ambiente Seguro
                </div>
                <p className="text-[11px] text-warm-500 leading-relaxed max-w-[200px] mx-auto">
                  Seus dados estão protegidos por criptografia de ponta a ponta.
                </p>
              </div>
            </Card>

            <Link href="/loja" className="flex items-center justify-center text-xs font-bold text-brand-600 hover:text-brand-900 transition-colors uppercase tracking-[0.2em] py-2">
              Escolher mais produtos
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
