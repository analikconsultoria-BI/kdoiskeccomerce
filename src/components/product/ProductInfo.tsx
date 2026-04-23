"use client";

import * as React from "react";
import { Check, ShoppingCart, Minus, Plus, Lock, RefreshCw, QrCode, Truck } from "lucide-react";
import { Product } from "@/types";
import { RatingStars } from "../common/RatingStars";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Badge } from "../ui/Badge";
import { TrustBadges } from "../common/TrustBadges";

interface ProductInfoProps {
  product: Product;
}

export const ProductInfo = ({ product }: ProductInfoProps) => {
  const [quantity, setQuantity] = React.useState(1);
  const [shippingCep, setShippingCep] = React.useState("");
  const [isCalculating, setIsCalculating] = React.useState(false);
  const [shippingResult, setShippingResult] = React.useState<null | { price: number; days: string }>(null);

  const calculateShipping = () => {
    if (shippingCep.length < 8) return;
    setIsCalculating(true);
    setTimeout(() => {
      setShippingResult({ price: 0, days: "3 a 5 dias úteis" });
      setIsCalculating(false);
    }, 1200);
  };

  const formattedPrice = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price);
  const formattedOriginalPrice = product.originalPrice 
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.originalPrice)
    : null;

  return (
    <div className="flex flex-col">
      {/* Categoria e Tags */}
      <div className="flex items-center gap-3 mb-4 mt-4 md:mt-0">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-600 bg-brand-50 px-2.5 py-1 rounded-md border border-brand-100">
          {product.category.name}
        </span>
        <div className="h-1 w-1 rounded-full bg-brand-200" />
        <span className="text-[10px] font-bold text-warm-400 uppercase tracking-widest">SKU: K2K-{product.id}</span>
      </div>

      <h1 className="text-2xl md:text-4xl font-extrabold text-brand-950 leading-tight mb-2 tracking-tight">
        {product.name}
      </h1>
      
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-1.5 rounded-full">
           <RatingStars rating={product.rating} size={14} />
           <span className="text-xs font-black text-brand-900">{product.rating.toFixed(1)}</span>
        </div>
        <div className="h-3 w-px bg-warm-200" />
        <span className="text-[11px] font-bold text-warm-500 uppercase tracking-widest underline underline-offset-4 decoration-warm-200">{product.reviewsCount} Avaliações</span>
        <div className="h-3 w-px bg-warm-200" />
        <span className="text-[11px] font-black text-accent-600 uppercase tracking-widest flex items-center gap-1">
           <Check className="w-3.5 h-3.5" strokeWidth={3} /> {product.soldCount}+ Vendidos
        </span>
      </div>

      {/* Preços e Buy Box (Amazon/ML Style) */}
      <div className="bg-white md:bg-brand-50/30 md:rounded-[2.5rem] md:p-8 md:border border-brand-100/50 md:shadow-soft-sm mb-8 space-y-6">
        <div className="flex flex-col">
          {formattedOriginalPrice && (
            <span className="text-sm text-warm-400 line-through font-medium mb-1">
              De {formattedOriginalPrice}
            </span>
          )}
          <div className="flex items-baseline gap-3">
            <span className="text-4xl md:text-5xl font-black text-brand-950 tracking-tighter">
              {formattedPrice}
            </span>
            {product.originalPrice && (
               <Badge className="bg-accent-500 text-white border-0 font-black px-2 py-0.5 rounded-md text-[10px]">
                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
               </Badge>
            )}
          </div>
          
          <div className="mt-2 flex flex-col gap-1">
            <p className="text-sm font-bold text-warm-600">
               em <span className="text-brand-700">{product.installments.count}x {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.installments.value)} sem juros</span>
            </p>
            <p className="text-[11px] font-medium text-accent-700 flex items-center gap-1">
               <QrCode className="w-3 h-3" /> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.pixPrice)} no PIX (Economize 5%)
            </p>
          </div>
        </div>

        {/* Status de Entrega */}
        <div className="space-y-4 pt-4 border-t border-warm-100">
           <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-warm-50 flex items-center justify-center shrink-0">
                 <Truck className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                 <p className="text-sm font-bold text-warm-900 leading-tight">
                    {product.freeShipping ? "Frete Grátis em todo o Brasil" : "Entrega Expressa Disponível"}
                 </p>
                 <p className="text-[11px] text-accent-600 font-black uppercase tracking-widest mt-1">
                    Chega entre {new Date().getDate() + 3} e {new Date().getDate() + 7} de {new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date())}
                 </p>
              </div>
           </div>
           
           <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-warm-50 flex items-center justify-center shrink-0">
                 <RefreshCw className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                 <p className="text-sm font-bold text-warm-900 leading-tight">Devolução Grátis</p>
                 <p className="text-[11px] text-warm-500 font-medium">Você tem 30 dias a partir do recebimento.</p>
              </div>
           </div>
        </div>
      </div>

      {/* Opções (Se houver variantes no futuro aqui é o lugar) */}
      
      {/* Quantidade e CTAs (Hidden on mobile if Sticky is active, or keep both) */}
      <div className="flex flex-col gap-4 mb-10">
        <div className="flex items-center h-14 bg-white border border-warm-200 rounded-2xl overflow-hidden shadow-sm w-fit">
          <button 
            className="w-12 h-full text-warm-400 hover:text-brand-700 hover:bg-brand-50 transition-colors border-r border-warm-100 flex items-center justify-center disabled:opacity-30"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            <Minus className="w-4 h-4" />
          </button>
          <div className="w-14 text-center font-black text-brand-900 text-lg">
            {quantity}
          </div>
          <button 
            className="w-12 h-full text-warm-400 hover:text-brand-700 hover:bg-brand-50 transition-colors border-l border-warm-100 flex items-center justify-center"
            onClick={() => setQuantity(quantity + 1)}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <Button size="lg" className="h-16 text-sm font-black uppercase tracking-[0.2em] shadow-xl shadow-accent-500/20 gap-3 group bg-accent-500 hover:bg-accent-600 rounded-2xl border-none">
             Comprar Agora
          </Button>
          <Button variant="outline" size="lg" className="h-16 text-sm font-black uppercase tracking-[0.2em] border-warm-200 bg-white hover:bg-warm-50 text-warm-700 rounded-2xl">
             Adicionar ao Carrinho
          </Button>
        </div>
      </div>

      {/* Frete Simulation - Refined */}
      <div className="bg-warm-50/50 p-6 rounded-3xl border border-warm-100/50">
        <label className="text-[10px] font-black text-warm-400 uppercase tracking-widest mb-3 block">Simular Frete</label>
        <div className="flex gap-2">
          <Input 
            placeholder="00000-000" 
            className="h-12 rounded-xl bg-white border-warm-200 focus:ring-brand-100 font-bold tracking-widest"
            maxLength={9}
            value={shippingCep}
            onChange={(e) => setShippingCep(e.target.value)}
          />
          <Button 
            className="h-12 px-6 rounded-xl font-bold uppercase text-[10px] tracking-widest"
            onClick={calculateShipping}
            disabled={isCalculating}
          >
            {isCalculating ? "..." : "OK"}
          </Button>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-6 pb-12 opacity-60">
         <div className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Compra Segura</span>
         </div>
      </div>
    </div>
  );
};

