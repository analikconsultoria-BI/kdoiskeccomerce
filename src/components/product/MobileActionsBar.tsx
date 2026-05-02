"use client";

import * as React from "react";
import Link from "next/link";
import { Home, Grid, ShoppingCart, Menu } from "lucide-react";
import { useCart } from "@/context/CartContext";

export const MobileActionsBar = () => {
  const { itemCount } = useCart();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-100 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-around py-2">
        <Link href="/" className="flex flex-col items-center gap-1 p-2">
          <Home className="w-5 h-5 text-warm-400" />
          <span className="text-[10px] font-bold text-warm-400">Início</span>
        </Link>
        <Link href="/loja" className="flex flex-col items-center gap-1 p-2">
          <Grid className="w-5 h-5 text-warm-400" />
          <span className="text-[10px] font-bold text-warm-400">Categorias</span>
        </Link>
        <Link href="/carrinho" className="flex flex-col items-center gap-1 p-2 relative">
          <ShoppingCart className="w-5 h-5 text-warm-400" />
          {itemCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-accent-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          )}
          <span className="text-[10px] font-bold text-warm-400">Carrinho</span>
        </Link>
        <button className="flex flex-col items-center gap-1 p-2">
          <Menu className="w-5 h-5 text-warm-400" />
          <span className="text-[10px] font-bold text-warm-400">Mais</span>
        </button>
      </div>
    </nav>
  );
};
