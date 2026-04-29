"use client";

import * as React from "react";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductTabs } from "@/components/product/ProductTabs";
import { SupportCTA } from "@/components/product/SupportCTA";
import { ContactBanner } from "@/components/common/ContactBanner";
import { MobileActionsBar } from "@/components/product/MobileActionsBar";
import { ProductCard } from "@/components/product/ProductCard";

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const [product, setProduct] = React.useState<any>(null);
  const [relatedProducts, setRelatedProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const resolvedParams = await params;
        const id = resolvedParams.slug;
        
        setLoading(true);
        const [productRes, relatedRes] = await Promise.all([
          fetch(`/api/produtos/${id}`, { cache: 'no-store' }),
          fetch('/api/produtos', { cache: 'no-store' })
        ]);

        if (!productRes.ok) throw new Error('Produto não encontrado');

        const productData = await productRes.json();
        const allProducts = await relatedRes.json();

        setProduct(productData);
        setRelatedProducts(allProducts.filter((p: any) => String(p.id) !== id).slice(0, 4));
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Carregando Produto...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        <Breadcrumb
          items={[
            { label: "Loja", href: "/loja" },
            { label: product.category.name, href: "/loja" },
            { label: product.name }
          ]}
          className="pt-6 pb-2 md:py-6"
        />

        {/* Main Product Area (2 cols on desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-16">
          <div className="lg:col-span-6 xl:col-span-7">
            <ProductGallery images={product.images.length > 0 ? product.images : ["https://placehold.co/600x400/f3f4f6/666666?text=Imagem+Indisponivel"]} />
          </div>

          <div className="lg:col-span-6 xl:col-span-5">
            <ProductInfo product={product} />
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-16">
          <ProductTabs product={product} />
        </div>
      </div>

      <SupportCTA />

      {/* Relacionados */}
      <div className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-2xl md:text-3xl font-black text-brand-950 mb-10 text-center md:text-left tracking-tighter">
            Quem viu, também viu
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>

      <ContactBanner />
      
      <MobileActionsBar product={product} />
    </div>
  );
}
