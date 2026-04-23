"use client";

import * as React from "react";
import Link from "next/link";
import { Heart, Star, Zap } from "lucide-react";
import { Product } from "@/types";
import { Card } from "../ui/Card";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [isFavorite, setIsFavorite] = React.useState(false);

  const formattedPrice = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price);
  const formattedOriginalPrice = product.originalPrice 
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.originalPrice)
    : null;

  // Split price for Marketplace Style: Symbol + Large Int + Small Cents
  const priceParts = formattedPrice.replace('R$', '').trim().split(',');

  return (
    <Card className="flex flex-col gap-0 group relative h-full bg-white border-warm-100 shadow-sm hover:shadow-md p-0 overflow-hidden rounded-2xl transition-all duration-300">
      {/* Top Action: Favorite (Shopee/Amazon persistence) */}
      <button 
        onClick={(e) => {
          e.preventDefault();
          setIsFavorite(!isFavorite);
        }}
        className="absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-warm-300 hover:text-red-500 transition-all active:scale-90"
      >
        <Heart className={`w-4 h-4 transition-all ${isFavorite ? 'fill-red-500 text-red-500 scale-110' : ''}`} />
      </button>

      <Link href={`/produto/${product.slug}`} className="flex flex-col h-full">
        {/* Marketplace Image - Clean centered look */}
        <div className="relative aspect-square bg-white flex items-center justify-center p-4 overflow-hidden">
          <img 
            src="/placeholder.jpg" 
            alt={product.name} 
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700" 
          />
          
          {/* Marketplace Badges (Mercado Livre / Shopee style) */}
          <div className="absolute top-0 left-0 z-10 flex flex-col items-start gap-1">
            {product.originalPrice && (
              <div className="bg-accent-500 text-white font-black text-[9px] px-2 py-0.5 rounded-br-lg shadow-sm">
                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </div>
            )}
            {product.badge === "Mais Vendido" && (
               <div className="bg-brand-900 text-white font-black text-[7px] px-1.5 py-0.5 rounded-r-md uppercase tracking-widest shadow-sm">
                  Mais Vendido
               </div>
            )}
          </div>

          {/* Quick Shipping (ML "FULL" style) */}
          {product.freeShipping && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-success/10 text-success text-[8px] font-black px-1.5 py-0.5 rounded border border-success/30 backdrop-blur-sm">
               <Zap className="w-2.5 h-2.5 fill-success" /> FULL
            </div>
          )}
        </div>

        {/* Content Area - Optimized for data density */}
        <div className="p-3 md:p-4 flex flex-col flex-1 border-t border-warm-50 bg-white">
          
          {/* Product Title - Amazon high density style */}
          <h3 className="font-medium text-brand-950 text-sm leading-snug line-clamp-2 h-10 mb-1 group-hover:text-brand-600 transition-colors">
            {product.name}
          </h3>

          {/* Shopee/ML style Rating and Sales - Refined Density */}
          <div className="flex items-center gap-1.5 mb-2">
             <div className="flex items-center gap-0.5">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <span className="text-[11px] font-black text-brand-950">{product.rating.toFixed(1)}</span>
             </div>
             <span className="text-[10px] text-warm-300 font-light">|</span>
             <span className="text-[11px] font-bold text-warm-500">{product.soldCount}+ vendidos</span>
          </div>

          {/* Pricing Section - Mercado Livre focus on Clarity */}
          <div className="mt-auto">
            {/* Original Price Slot - Always occupies space */}
            <div className="h-4 mb-0.5">
              {formattedOriginalPrice && (
                <span className="text-[11px] text-warm-400 line-through font-medium leading-none block px-0.5">
                  {formattedOriginalPrice}
                </span>
              )}
            </div>
            
            <div className="flex items-baseline gap-0.5 text-black">
               <span className="text-sm font-bold mr-0.5 self-start mt-1.5 leading-none">R$</span>
               <span className="text-[30px] md:text-[34px] font-black leading-none tracking-tighter">
                  {priceParts[0]}
               </span>
               <span className="text-[14px] font-black self-start mt-1.5 leading-none">
                  {priceParts[1] ? `,${priceParts[1]}` : ''}
               </span>
            </div>

            {/* Clear Installments (Mercado Livre Style Benefit) */}
            <div className="text-[11px] font-bold text-success mt-1">
              <span className="font-black">{product.installments.count}x</span> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.installments.value)} <span className="font-medium">sem juros</span>
            </div>

            {/* Shipping Slot - Always occupies space to keep grids aligned */}
            <div className="h-4 mt-1.5">
              {product.freeShipping && (
                 <div className="text-[11px] font-bold text-success flex items-center gap-1">
                    Frete Grátis
                 </div>
              )}
            </div>
          </div>
        </div>
      </Link>

    </Card>
  );
};
