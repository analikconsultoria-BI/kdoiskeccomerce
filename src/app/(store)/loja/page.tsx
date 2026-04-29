"use client";

import * as React from "react";
import { SlidersHorizontal, ChevronDown, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { FiltersSidebar } from "@/components/shop/FiltersSidebar";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { Pagination } from "@/components/shop/Pagination";

import { Suspense } from 'react';

function LojaInner() {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = React.useState(false);
  const [products, setProducts] = React.useState<any[]>([]);
  const [categories, setCategories] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  
  const searchParams = useSearchParams();
  const busca = searchParams.get('busca') || '';
  const initialCategory = searchParams.get('categoria');

  React.useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  React.useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          fetch(`/api/produtos?busca=${encodeURIComponent(busca)}`, { cache: 'no-store' }),
          fetch('/api/categorias', { cache: 'no-store' })
        ]);

        if (!productsRes.ok || !categoriesRes.ok) throw new Error('Falha ao carregar dados');

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();

        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [busca]);

  const filteredProducts = selectedCategory 
    ? products.filter(p => String(p.category?.id) === String(selectedCategory))
    : products;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-red-100">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Ops! Algo deu errado</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-brand-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-brand-700 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Breadcrumb 
          items={[{ label: "Loja" }]} 
          className="py-4"
        />

        {/* Header da Página */}
        <div className="relative overflow-hidden rounded-3xl mb-8 group min-h-[160px] flex items-center">
          {selectedCategory && categories.find(c => String(c.id) === selectedCategory)?.imagem ? (
            <div className="absolute inset-0 z-0">
              <img 
                src={categories.find(c => String(c.id) === selectedCategory)?.imagem} 
                alt="Banner" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-r from-brand-950 via-brand-950/60 to-transparent" />
            </div>
          ) : (
            <div className="absolute inset-0 z-0 bg-linear-to-br from-brand-900 to-brand-950" />
          )}
          
          <div className="relative z-10 px-8 py-10">
            <h1 className="text-3xl md:text-5xl font-black text-white mb-2 tracking-tight uppercase">
              {selectedCategory ? categories.find(c => String(c.id) === selectedCategory)?.nome : 'Nossa Loja'}
            </h1>
            <p className="text-brand-100 font-medium">
              {loading ? 'Carregando produtos...' : `Exibindo ${filteredProducts.length} produtos premium.`}
            </p>
          </div>
        </div>

        {/* Main Layout 2 columns */}
        <div className="flex flex-col md:flex-row gap-8">
          <FiltersSidebar 
            isMobileOpen={isMobileFiltersOpen} 
            onMobileClose={() => setIsMobileFiltersOpen(false)}
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
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
                Filtros
              </button>

              {/* Active Filters Chips (Desktop) */}
              <div className="hidden md:flex items-center gap-2 flex-wrap">
                {selectedCategory && (
                  <span className="inline-flex items-center gap-1 bg-brand-100 text-brand-700 px-3 py-1 rounded-full text-sm font-medium">
                    {categories.find(c => String(c.id) === selectedCategory)?.nome || 'Categoria'} 
                    <button onClick={() => setSelectedCategory(null)} className="hover:text-brand-900"><X className="w-3 h-3" /></button>
                  </span>
                )}
              </div>

              {/* Sorting */}
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <span className="text-sm text-gray-600 font-medium">Ordenar por:</span>
                <div className="relative">
                  <select className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-brand-300 focus:border-brand-500 font-medium text-gray-700 cursor-pointer">
                    <option>Relevância</option>
                    <option>Menor preço</option>
                    <option>Maior preço</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-gray-100" />
                ))}
              </div>
            ) : (
              <ProductGrid products={filteredProducts} />
            )}

            {/* Pagination */}
            {!loading && filteredProducts.length > 0 && (
              <Pagination currentPage={1} totalPages={1} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Loja() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-2xl font-bold text-brand-300">Carregando loja...</div>
      </div>
    }>
      <LojaInner />
    </Suspense>
  );
}
