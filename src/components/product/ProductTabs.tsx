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

  return (
    <div className="w-full">
      {/* Tab Headers */}
      <div className="flex border-b border-warm-100 w-full overflow-x-auto hide-scrollbar gap-8">
        {[
          { id: "desc", label: "Descrição" },
          { id: "specs", label: "Especificações" },
          { id: "reviews", label: `Avaliações (${product.reviewsCount || 0})`, hidden: (product.reviewsCount || 0) === 0 }
        ].filter(tab => !tab.hidden).map((tab) => (
          <button
            key={tab.id}
            className={`pb-4 font-bold text-sm uppercase tracking-[0.2em] transition-all relative
              ${activeTab === tab.id ? "text-brand-900" : "text-warm-400 hover:text-brand-600"}`}
            onClick={() => setActiveTab(tab.id as any)}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-brand-600 rounded-full animate-fade-in" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="py-16">
        {activeTab === "desc" && (
          <div className="max-w-4xl">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div 
                  className="prose prose-brand max-w-none text-warm-600 leading-relaxed text-lg font-medium"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description || '') }}
                />
                {product.benefits && product.benefits.length > 0 && (
                  <div className="bg-warm-50 rounded-[2.5rem] p-8 border border-warm-100 flex flex-col gap-6">
                    <h4 className="text-brand-900 font-black uppercase tracking-widest text-xs">Destaques do Produto</h4>
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
          </div>
        )}

        {activeTab === "specs" && product.specifications && (
          <div className="max-w-2xl bg-white rounded-3xl border border-warm-100 overflow-hidden shadow-soft-sm">
            <table className="w-full text-left">
              <tbody>
                {Object.entries(product.specifications)
                  .filter(([_, value]) => value && String(value).trim() !== '')
                  .map(([key, value], index) => (
                  <tr key={key} className={index % 2 === 0 ? "bg-warm-50/30" : "bg-white"}>
                    <th className="py-5 px-8 font-black text-[10px] uppercase tracking-[0.2em] text-warm-400 w-1/3 border-b border-warm-50">
                      {key}
                    </th>
                    <td className="py-5 px-8 text-sm font-bold text-brand-900 border-b border-warm-50">
                      {String(value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="py-12 text-center bg-brand-50/30 rounded-[3rem] border border-brand-100/50">
            <p className="text-warm-500 font-medium">Ainda não há avaliações para este produto.</p>
          </div>
        )}
      </div>
    </div>
  );
};
