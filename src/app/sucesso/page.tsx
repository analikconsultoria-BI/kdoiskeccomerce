"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2, Package, Calendar, Mail, ArrowRight, Printer } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function OrderSuccessPage() {
  const orderNumber = "KD-887413";
  
  return (
    <div className="bg-warm-50 min-h-screen py-16 md:py-24 px-4">
      <div className="max-w-3xl mx-auto text-center">
        
        {/* Animated Success Icon */}
        <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-float">
          <CheckCircle2 className="w-12 h-12 text-success" />
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-brand-900 tracking-tighter mb-4 leading-none">
          Pedido Realizado!
        </h1>
        <p className="text-warm-500 font-bold uppercase tracking-[0.2em] text-xs mb-12">
          O seu problema está prestes a ser resolvido.
        </p>

        <Card className="p-8 md:p-12 border-brand-100 shadow-(--shadow-elevated) bg-white relative overflow-hidden text-left mb-10">
          {/* Subtle background element */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-brand-50 rounded-full -mr-20 -mt-20 blur-3xl opacity-50" />
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between gap-8 mb-10">
              <div>
                <span className="text-[10px] font-black text-warm-400 uppercase tracking-widest block mb-1">Número do Pedido</span>
                <span className="text-2xl font-black text-brand-900">#{orderNumber}</span>
              </div>
              <div className="md:text-right">
                <span className="text-[10px] font-black text-warm-400 uppercase tracking-widest block mb-1">Status atual</span>
                <span className="inline-flex items-center gap-2 bg-accent-100 text-accent-700 px-3 py-1 rounded-full text-xs font-bold tracking-tight">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse" /> Processando Pagamento
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-y border-brand-50">
              <div className="flex gap-4">
                 <div className="w-10 h-10 rounded-xl bg-warm-100 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-brand-600" />
                 </div>
                 <div>
                    <h4 className="text-sm font-bold text-brand-900 mb-1">Fique de olho no e-mail</h4>
                    <p className="text-xs text-warm-500 leading-relaxed">Enviamos todos os detalhes do pedido e nota fiscal para o seu endereço cadastrado.</p>
                 </div>
              </div>
              <div className="flex gap-4">
                 <div className="w-10 h-10 rounded-xl bg-warm-100 flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5 text-brand-600" />
                 </div>
                 <div>
                    <h4 className="text-sm font-bold text-brand-900 mb-1">Previsão de Entrega</h4>
                    <p className="text-xs text-warm-500 leading-relaxed">Seus produtos devem chegar em sua residência em até <strong>3 dias úteis</strong>.</p>
                 </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6">
               <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-warm-400" />
                  <span className="text-xs font-bold text-warm-500 tracking-tight">Realizado em 19 de Abril, 2026 às 14:35</span>
               </div>
               <button className="flex items-center gap-2 text-xs font-bold text-brand-700 hover:text-brand-900 transition-colors uppercase tracking-widest">
                  <Printer className="w-4 h-4" /> Imprimir Comprovante
               </button>
            </div>
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/loja" className="w-full sm:w-auto">
             <Button variant="secondary" size="lg" className="w-full sm:w-auto px-10">
                VOLTAR PARA A LOJA
             </Button>
          </Link>
          <Link href="/loja" className="w-full sm:w-auto">
             <Button size="lg" className="w-full sm:w-auto px-10">
                VER MEUS PEDIDOS <ArrowRight className="w-4 h-4 ml-2" />
             </Button>
          </Link>
        </div>

        <div className="mt-16 text-warm-400 text-[10px] font-bold uppercase tracking-[0.3em]">
          Obrigado por escolher a KdoisK
        </div>
      </div>
    </div>
  );
}
