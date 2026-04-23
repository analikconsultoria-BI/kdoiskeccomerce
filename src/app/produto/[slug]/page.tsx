import * as React from "react";
import { notFound } from "next/navigation";
import { getProductBySlug, mockProducts } from "@/lib/mockData";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductTabs } from "@/components/product/ProductTabs";
import { SupportCTA } from "@/components/product/SupportCTA";
import { ContactBanner } from "@/components/common/ContactBanner";
import { MobileActionsBar } from "@/components/product/MobileActionsBar";
import { ProductCard } from "@/components/product/ProductCard";

// O Next.js exige gerar os params dinâmicos se usarmos SSG, mas aqui é só protótipo básico
export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug) || mockProducts[0]; // fallback to first for prototype testing

  if (!product) {
    notFound();
  }

  // Pegar 4 produtos relacionados para placeholder
  const relatedProducts = mockProducts.slice(1, 5);

  return (
    <div className="bg-white min-h-screen pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* Breadcrumb - Hidden on desktop if needed, but keeping for now */}
        <Breadcrumb
          items={[
            { label: "Loja", href: "/loja" },
            { label: product.category.name, href: `/loja?categoria=${product.category.slug}` },
            { label: product.name }
          ]}
          className="pt-6 pb-2 md:py-6"
        />

        {/* Main Product Area (2 cols on desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-16">
          <div className="lg:col-span-6 xl:col-span-7">
            <ProductGallery images={product.images} />
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

      {/* Logical Step After Reviews */}
      <SupportCTA />

      {/* Relacionados */}
      <div className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-2xl md:text-3xl font-black text-brand-950 mb-10 text-center md:text-left tracking-tighter">
            Quem viu, também viu
          </h2>
          {/* Reuse ProductGrid but max 4 items desktop */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>

      <ContactBanner />
      
      {/* Mobile Sticky CTA */}
      <MobileActionsBar product={product} />
    </div>
  );
}
