"use client";

import * as React from "react";
import { SlidersHorizontal, ChevronDown, X } from "lucide-react";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { FiltersSidebar } from "@/components/shop/FiltersSidebar";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { Pagination } from "@/components/shop/Pagination";
import { mockProducts } from "@/lib/mockData";

export default function Loja() {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = React.useState(false);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Breadcrumb 
          items={[{ label: "Loja" }]} 
          className="py-4"
        />

        {/* Header da Página */}
        <div className="py-8 bg-white rounded-xl px-6 mb-8 shadow-sm">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-900 mb-2">Nossa Loja</h1>
          <p className="text-gray-600">Exibindo 1-24 de 156 produtos</p>
        </div>

        {/* Main Layout 2 columns */}
        <div className="flex flex-col md:flex-row gap-8">
          <FiltersSidebar 
            isMobileOpen={isMobileFiltersOpen} 
            onMobileClose={() => setIsMobileFiltersOpen(false)} 
          />

          <div className="flex-1 flex flex-col">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              
              {/* Mobile Filter Button */}
              <button 
                className="md:hidden flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg font-medium text-gray-700 shadow-sm"
                onClick={() => setIsMobileFiltersOpen(true)}
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filtros (3)
              </button>

              {/* Active Filters Chips (Desktop) */}
              <div className="hidden md:flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 bg-brand-100 text-brand-700 px-3 py-1 rounded-full text-sm font-medium">
                  Pilhas e Baterias <button className="hover:text-brand-900"><X className="w-3 h-3" /></button>
                </span>
                <span className="inline-flex items-center gap-1 bg-brand-100 text-brand-700 px-3 py-1 rounded-full text-sm font-medium">
                  5 Estrelas <button className="hover:text-brand-900"><X className="w-3 h-3" /></button>
                </span>
              </div>

              {/* Sorting */}
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <span className="text-sm text-gray-600 font-medium">Ordenar por:</span>
                <div className="relative">
                  <select className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-brand-300 focus:border-brand-500 font-medium text-gray-700 cursor-pointer">
                    <option>Relevância</option>
                    <option>Menor preço</option>
                    <option>Maior preço</option>
                    <option>Mais vendidos</option>
                    <option>Melhor avaliação</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Grid */}
            <ProductGrid products={mockProducts} />

            {/* Pagination */}
            <Pagination currentPage={1} totalPages={7} />
          </div>
        </div>
      </div>
    </div>
  );
}
