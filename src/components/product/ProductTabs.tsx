"use client";

import * as React from "react";
import { Product } from "@/types";
import { mockReviews } from "@/lib/mockData";
import { RatingStars } from "../common/RatingStars";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Check } from "lucide-react";

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
          { id: "reviews", label: `Avaliações (${product.reviewsCount})`, hidden: product.reviewsCount === 0 }
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
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
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
             </div>
          </div>
        )}

        {activeTab === "specs" && (
          <div className="max-w-2xl bg-white rounded-3xl border border-warm-100 overflow-hidden shadow-soft-sm">
            <table className="w-full text-left">
              <tbody>
                {Object.entries(product.specifications).map(([key, value], index) => (
                  <tr key={key} className={index % 2 === 0 ? "bg-warm-50/30" : "bg-white"}>
                    <th className="py-5 px-8 font-black text-[10px] uppercase tracking-[0.2em] text-warm-400 w-1/3 border-b border-warm-50">
                      {key}
                    </th>
                    <td className="py-5 px-8 text-sm font-bold text-brand-900 border-b border-warm-50">
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="flex flex-col max-w-4xl">
            {/* Reviews Header Premium */}
            <div className="flex flex-col md:flex-row items-center gap-12 mb-16 bg-brand-50/20 p-10 rounded-[3rem] border border-brand-100/50 shadow-soft-sm">
              <div className="flex flex-col items-center justify-center text-center px-8 border-r border-brand-100">
                <span className="text-6xl font-black text-brand-950 mb-3 tracking-tighter">{product.rating.toFixed(1)}</span>
                <RatingStars rating={product.rating} size={20} className="mb-3" />
                <span className="text-[10px] font-black text-warm-400 uppercase tracking-widest">Baseado em {product.reviewsCount} avaliações</span>
              </div>

              <div className="flex-1 w-full space-y-3">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-[10px] font-black text-warm-500 w-12">
                      {star} <RatingStars rating={1} size={10} />
                    </div>
                    <div className="flex-1 h-2 bg-warm-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-400 rounded-full" 
                        style={{ width: star === 5 ? "85%" : star === 4 ? "10%" : "2%" }}
                      ></div>
                    </div>
                    <span className="text-[10px] font-bold text-warm-400 w-8">{star === 5 ? "85%" : star === 4 ? "10%" : "0%"}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center">
                <Button variant="secondary" className="h-14 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-brand-100">
                   Escrever minha avaliação
                </Button>
              </div>
            </div>

            {/* Review List */}
            <div className="space-y-8">
              {mockReviews.map((review) => (
                <div key={review.id} className="bg-white border-b border-warm-100 pb-10 flex flex-col gap-5">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <RatingStars rating={review.rating} size={14} />
                        <span className="font-black text-brand-950 text-base">{review.title}</span>
                      </div>
                      <p className="text-warm-600 font-medium leading-relaxed italic pr-12">
                        &ldquo;{review.content}&rdquo;
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-warm-300 uppercase tracking-widest">{review.date}</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-warm-100 flex items-center justify-center font-bold text-warm-500 text-xs">
                       {review.author.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                       <span className="font-bold text-warm-900 text-sm">{review.author}</span>
                       <span className="text-[9px] text-accent-600 flex items-center gap-1 font-black uppercase tracking-widest">
                          <Check className="w-3 h-3" strokeWidth={3} /> Compra Verificada
                       </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Button variant="ghost" className="font-black text-[10px] uppercase tracking-[0.2em] text-brand-600">
                 Ver todas as {product.reviewsCount} avaliações
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
