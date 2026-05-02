"use client";

import * as React from "react";
import { Product } from "@/types";
import { RatingStars } from "../common/RatingStars";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Check } from "lucide-react";
import DOMPurify from "isomorphic-dompurify";

interface ProductTabsProps {
  product: Product;
}

export const ProductTabs = ({ product }: ProductTabsProps) => {
  const [activeTab, setActiveTab] = React.useState<"desc" | "specs" | "reviews">("desc");

  const descriptionContent = (
    <div className="flex flex-col gap-8">
      <div 
        className="prose prose-brand max-w-none text-warm-600 leading-relaxed text-lg font-medium text-justify"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description || '') }}
      />
      {product.benefits && product.benefits.length > 0 && (
        <div className="bg-warm-50 rounded-[2.5rem] p-8 border border-warm-100 flex flex-col gap-6 lg:hidden">
          <h4 className="text-warm-900 font-bold uppercase tracking-wide text-xs">Destaques do Produto</h4>
          <div className="space-y-4">
              {product.benefits.map((benefit, i) => (
                <div key={i} className="flex items-start gap-3">
                   <div className="w-5 h-5 rounded-full bg-accent-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" strokeWidth={4} />
                   </div>
                   <span className="text-sm font-bold text-warm-700">{benefit}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );

  const specificationsContent = product.specifications ? (
    <div className="bg-white rounded-3xl border border-warm-100 overflow-hidden shadow-soft-sm h-fit">
      <table className="w-full text-left">
        <tbody>
          {Object.entries(product.specifications)
            .filter(([_, value]) => value && String(value).trim() !== '')
            .map(([key, value], index) => (
            <tr key={key} className={index % 2 === 0 ? "bg-warm-50/30" : "bg-white"}>
              <th className="py-4 px-6 font-bold text-[10px] uppercase tracking-wide text-warm-400 w-1/3 border-b border-warm-50">
                {key}
              </th>
              <td className="py-4 px-6 text-sm font-bold text-warm-900 border-b border-warm-50">
                {String(value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : null;

  return (
    <div className="w-full">
      {/* MOBILE TABS — Só visível em mobile */}
      <div className="md:hidden">
        <div className="flex border-b border-warm-100 w-full overflow-x-auto hide-scrollbar gap-8">
          {[
            { id: "desc", label: "Descrição" },
            { id: "specs", label: "Especificações" },
            { id: "reviews", label: `Avaliações (${product.reviewsCount || 0})`, hidden: (product.reviewsCount || 0) === 0 }
          ].filter(tab => !tab.hidden).map((tab) => (
            <button
              key={tab.id}
              className={`pb-4 font-bold text-sm uppercase tracking-wide transition-all relative
                ${activeTab === tab.id ? "text-warm-900" : "text-warm-400 hover:text-brand-700"}`}
              onClick={() => setActiveTab(tab.id as any)}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-brand-700 rounded-full animate-fade-in" />
              )}
            </button>
          ))}
        </div>

        <div className="py-10">
          {activeTab === "desc" && descriptionContent}
          {activeTab === "specs" && specificationsContent}
          {activeTab === "reviews" && (
            <div className="py-12 text-center bg-brand-50/30 rounded-[3rem] border border-brand-100/50">
              <p className="text-warm-500 font-medium">Ainda não há avaliações para este produto.</p>
            </div>
          )}
        </div>
      </div>

      {/* DESKTOP GRID — Só visível em desktop */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-[60%_40%] gap-12 mt-12">
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-bold text-warm-900 uppercase tracking-wide">Descrição</h2>
          {descriptionContent}
        </div>

        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-bold text-warm-900 uppercase tracking-wide">Especificações</h2>
          {specificationsContent}
          
          {/* Se houver avaliações no desktop, mostrar aqui embaixo */}
          {product.reviewsCount > 0 && (
            <div className="mt-8 pt-8 border-t border-warm-100">
               <h3 className="text-lg font-bold text-warm-900 mb-4 uppercase tracking-wide">Avaliações</h3>
               <div className="py-8 text-center bg-brand-50/30 rounded-2xl border border-brand-100/50">
                 <p className="text-xs text-warm-500 font-bold uppercase tracking-wide">({product.reviewsCount}) Clientes Avaliaram</p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
