"use client";

import * as React from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { RatingStars } from "../common/RatingStars";
import { Button } from "../ui/Button";

interface FiltersSidebarProps {
  className?: string;
  isMobileOpen: boolean;
  onMobileClose: () => void;
  categories: any[];
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
}

export const FiltersSidebar = ({ 
  className = "", 
  isMobileOpen, 
  onMobileClose,
  categories,
  selectedCategory,
  onSelectCategory
}: FiltersSidebarProps) => {
  
  const content = (
    <>
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-bold text-xl text-brand-900">Filtros</h4>
        <button 
          onClick={() => onSelectCategory(null)}
          className="text-sm font-medium text-brand-700 hover:text-brand-900 transition-colors bg-transparent hidden md:block"
        >
          Limpar
        </button>
        <button className="md:hidden" onClick={onMobileClose}>
          <X className="w-6 h-6 text-gray-500" />
        </button>
      </div>

      <div className="space-y-6">
        {/* Categorias */}
        <div>
          <h4 className="font-semibold text-lg text-gray-900 mb-3">Categorias</h4>
          <div className="space-y-2">
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="radio" 
                  name="category"
                  checked={selectedCategory === String(cat.id)}
                  onChange={() => {
                    onSelectCategory(String(cat.id));
                    if (window.innerWidth < 768) onMobileClose();
                  }}
                  className="w-5 h-5 border-gray-300 text-brand-700 focus:ring-brand-500 cursor-pointer" 
                />
                <span className={`transition-colors ${selectedCategory === String(cat.id) ? 'text-brand-700 font-bold' : 'text-gray-700 group-hover:text-brand-700'}`}>
                  {cat.nome}
                </span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="h-px bg-gray-100 w-full"></div>

        {/* Avaliação - Static for now as Bling doesn't provide this */}
        <div>
          <h4 className="font-semibold text-lg text-gray-900 mb-3">Avaliação</h4>
          <div className="space-y-2">
            {[5, 4, 3, 2].map((stars) => (
              <label key={stars} className="flex items-center gap-3 cursor-pointer group opacity-50">
                <input type="radio" name="rating" disabled className="w-5 h-5 border-gray-300 text-brand-700 focus:ring-brand-500 cursor-not-allowed" />
                <RatingStars rating={stars} />
                <span className="text-sm text-gray-600">& acima</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden md:block w-72 sticky top-24 bg-white rounded-xl p-6 border border-gray-100 h-fit ${className}`}>
        {content}
      </aside>

      {/* Mobile Bottom Sheet/Drawer */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50" onClick={onMobileClose}>
          <div 
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {content}
          </div>
        </div>
      )}
    </>
  );
};
