"use client";

import * as React from "react";
import { Check, ShoppingCart, Minus, Plus, Lock, RefreshCw, QrCode, Truck, ExternalLink } from "lucide-react";
import { Product } from "@/types";
import { RatingStars } from "../common/RatingStars";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Badge } from "../ui/Badge";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

interface ProductInfoProps {
  product: Product;
}

export const ProductInfo = ({ product }: ProductInfoProps) => {
  const [quantity, setQuantity] = React.useState(1);
  const [added, setAdded] = React.useState(false);
  const [selectedVariant, setSelectedVariant] = React.useState<string | null>(null);
  const { addToCart } = useCart();
  const router = useRouter();

  // Mocking variations to fulfill requirement
  const variants = (product as any).variations || [];

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/carrinho');
  };

  const formattedPrice = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price);
  const formattedPix = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.pixPrice);
  const formattedOriginalPrice = product.originalPrice 
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.originalPrice)
    : null;

  return (
    <div className="flex flex-col">
      {/* 1. Nome do produto (max 2 lines, smaller font but keeping original classes) */}
      <h1 className="text-xl md:text-3xl font-bold text-warm-900 leading-tight mb-2 tracking-tight line-clamp-2 mt-4 md:mt-0">
        {product.name}
      </h1>
      
      {/* 2. Avaliações + quantidade vendida (keeping original classes) */}
      <div className="flex items-center gap-4 mb-6">
        {product.rating > 0 && (
          <>
            <div className="flex items-center gap-1.5 rounded-full">
               <RatingStars rating={product.rating} size={14} />
               <span className="text-xs font-bold text-warm-900">{product.rating.toFixed(1)}</span>
            </div>
            {product.reviewsCount > 0 && (
              <>
                <div className="h-3 w-px bg-warm-200" />
                <span className="text-[11px] font-bold text-warm-500 uppercase tracking-wide underline underline-offset-4 decoration-warm-200">{product.reviewsCount} Avaliações</span>
              </>
            )}
            <div className="h-3 w-px bg-warm-200" />
          </>
        )}
        <span className="text-[11px] font-bold text-accent-600 uppercase tracking-wide flex items-center gap-1">
           <Check className="w-3.5 h-3.5" strokeWidth={3} /> 
           {product.soldCount > 0 ? `${product.soldCount}+ Vendidos` : 'Novo'}
        </span>
      </div>

      {/* 3. Preço PIX em destaque + preço parcelado abaixo (original styling context) */}
      <div className="py-2 mb-6 flex flex-col justify-center">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 mb-3">
            {formattedOriginalPrice && (
              <span className="text-sm text-warm-400 line-through font-medium">
                De {formattedOriginalPrice}
              </span>
            )}
            {product.originalPrice && (
               <Badge className="bg-accent-500 text-white border-0 font-bold px-2 py-0.5 rounded-md text-[10px]">
                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
               </Badge>
            )}
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl md:text-5xl font-bold text-warm-900 tracking-tighter">
              {formattedPix}
            </span>
            <span className="text-xs font-bold text-accent-600 uppercase tracking-wide">no PIX</span>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-warm-500 font-medium">
               ou <span className="font-bold text-warm-900">{formattedPrice}</span> em até <span className="font-bold text-brand-700">{product.installments?.count || 12}x {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.installments?.value || (product.price / 12))} sem juros</span>
            </p>
          </div>
        </div>
      </div>

      {/* 4. Variações (Chips clicáveis) */}
      {variants && variants.length > 0 && (
        <div className="mb-6">
          <span className="text-[10px] font-bold text-warm-400 uppercase tracking-wide mb-3 block">Opções:</span>
          <div className="flex flex-wrap gap-2">
            {variants.map((v: string, i: number) => (
              <button 
                key={i}
                onClick={() => setSelectedVariant(v)}
                className={`px-4 py-2 rounded-2xl border-2 text-sm font-bold transition-all ${
                  selectedVariant === v 
                    ? 'border-brand-700 bg-brand-50 text-brand-700 shadow-sm' 
                    : 'border-warm-200 text-warm-700 hover:border-warm-300 hover:bg-warm-50'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 mb-10">
        {/* 5. Quantidade compacto inline */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-warm-500 uppercase tracking-wide">Qtd:</span>
          <div className="flex items-center border border-warm-200 rounded-lg overflow-hidden bg-white shadow-sm">
            <button 
              className="w-8 h-8 flex items-center justify-center hover:bg-warm-50 text-warm-900 font-bold transition-colors disabled:opacity-30"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-10 text-center text-sm font-bold text-warm-900">
              {quantity}
            </span>
            <button 
              className="w-8 h-8 flex items-center justify-center hover:bg-warm-50 text-warm-900 font-bold transition-colors"
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 6 & 7. Botões CTA */}
        <div className="flex flex-col gap-3">
          <Button 
            onClick={handleBuyNow}
            size="lg" className="h-16 text-sm font-bold uppercase tracking-wide shadow-xl shadow-accent-500/10 gap-3 group bg-accent-500 hover:bg-accent-600 rounded-2xl border-none w-full text-white"
          >
             Comprar Agora
          </Button>
          <Button 
            onClick={handleAddToCart}
            variant="outline" size="lg" className="h-16 text-sm font-bold uppercase tracking-wide border-brand-700 bg-white hover:bg-brand-50 text-brand-700 rounded-2xl w-full"
          >
             {added ? "Adicionado!" : "Adicionar ao Carrinho"}
          </Button>

          {(product.link_shopee || product.link_mercadolivre) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              {product.link_shopee && (
                <a 
                  href={product.link_shopee} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 h-14 bg-[#EE4D2D] hover:bg-[#ff5d3d] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md shadow-orange-200 w-full"
                >
                  <ShoppingCart className="w-4 h-4" /> Comprar na Shopee
                </a>
              )}
              {product.link_mercadolivre && (
                <a 
                  href={product.link_mercadolivre} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 h-14 bg-[#FFF159] hover:bg-[#fff585] text-[#333333] rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md shadow-yellow-100 w-full"
                >
                  <ExternalLink className="w-4 h-4" /> Mercado Livre
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 8. Benefícios rápidos (inline) */}
      <div className="grid grid-cols-3 gap-2 border-t border-warm-100 pt-6 mt-2">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-warm-50 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5 text-brand-600" />
          </div>
          <span className="text-[10px] md:text-xs text-warm-600 font-bold uppercase tracking-widest">Frete Rápido</span>
        </div>
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-warm-50 flex items-center justify-center shrink-0">
            <RefreshCw className="w-5 h-5 text-brand-600" />
          </div>
          <span className="text-[10px] md:text-xs text-warm-600 font-bold uppercase tracking-widest">Devolução Grátis</span>
        </div>
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-warm-50 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5 text-brand-600" />
          </div>
          <span className="text-[10px] md:text-xs text-warm-600 font-bold uppercase tracking-widest">Compra Segura</span>
        </div>
      </div>
    </div>
  );
};

