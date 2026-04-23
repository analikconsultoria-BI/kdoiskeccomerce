"use client";

import * as React from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "../ui/Button";
import { Product } from "@/types";

interface MobileActionsBarProps {
  product: Product;
}

export const MobileActionsBar = ({ product }: MobileActionsBarProps) => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      // Show bar after user scrolls past the main buy buttons
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition > 600);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-warm-100 p-4 transition-transform duration-500 md:hidden shadow-[0_-10px_20px_rgba(0,0,0,0.05)]
        ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}
    >
      <div className="flex gap-3 items-center">
        <div className="flex-1 flex flex-col">
           <span className="text-[10px] font-black text-warm-400 uppercase tracking-tighter line-clamp-1">{product.name}</span>
           <span className="text-sm font-black text-brand-950">
             {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
           </span>
        </div>
        
        <div className="flex gap-2">
           <Button variant="outline" className="h-12 w-12 p-0 rounded-xl border-warm-200">
              <ShoppingCart className="w-5 h-5 text-brand-900" />
           </Button>
            <Button className="h-12 px-6 rounded-xl bg-accent-500 hover:bg-accent-600 text-white text-[10px] font-black uppercase tracking-widest whitespace-nowrap shadow-lg shadow-accent-500/20">
              Comprar Agora
           </Button>
        </div>
      </div>
    </div>
  );
};
