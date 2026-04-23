"use client";

import * as React from "react";
import { Sparkles, Check } from "lucide-react";
import { Button } from "../ui/Button";

export const ContactBanner = () => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("PRIMEIRA10");
    setCopied(true);
  };

  return (
    <section className="relative overflow-hidden py-24 bg-white">
      {/* Elementos Decorativos de Fundo */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-100/40 rounded-full blur-[100px] -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-100/30 rounded-full blur-[100px] translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div 
          className={`relative rounded-[3rem] p-8 md:p-20 text-center shadow-2xl overflow-hidden group transition-all duration-700
            ${copied ? 'bg-linear-to-br from-brand-900 via-brand-950 to-brand-900 scale-[1.02]' : 'bg-linear-to-br from-brand-950 via-brand-950 to-brand-900'}
          `}
        >
          {/* Efeito de Varredura de Brilho (Shine) */}
          {copied && (
            <div className="absolute inset-0 z-20 pointer-events-none">
               <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.5s_ease-in-out]" />
            </div>
          )}

          {/* Partículas de Sucesso (Confetes) */}
          {copied && (
            <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
               {[...Array(12)].map((_, i) => (
                 <div 
                   key={i}
                   className="absolute bg-accent-400 rounded-full animate-ping opacity-0"
                   style={{
                     width: `${Math.random() * 10 + 5}px`,
                     height: `${Math.random() * 10 + 5}px`,
                     top: `${Math.random() * 100}%`,
                     left: `${Math.random() * 100}%`,
                     animationDelay: `${Math.random() * 0.5}s`,
                     animationDuration: `${Math.random() * 1 + 1}s`,
                     opacity: 0.6
                   }}
                 />
               ))}
            </div>
          )}

          {/* Brilho Interno Fixo */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
          
          <div className="max-w-3xl mx-auto space-y-10 relative z-40">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-brand-200 text-[10px] font-black uppercase tracking-[0.3em]">
              <Sparkles className={`w-3.5 h-3.5 transition-colors ${copied ? 'text-accent-300' : 'text-accent-400'}`} /> 
              {copied ? 'Código Salvo!' : 'Oferta de Boas-vindas'}
            </div>
            
            <div className={`space-y-6 transition-all duration-500 ${copied ? 'scale-95 opacity-90' : ''}`}>
              <h2 className="text-3xl md:text-6xl font-black text-white leading-[1.1] tracking-tighter">
                {copied ? (
                  <>Seu desconto está <span className="text-accent-400 italic">Pronto!</span></>
                ) : (
                  <>Garanta <span className="text-accent-400">10% OFF</span> na sua primeira compra</>
                )}
              </h2>
              
              <p className="text-brand-100/70 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                {copied ? 'O cupom já foi copiado. Já pode escolher seus produtos favoritos na loja!' : 'Utilize o cupom abaixo no checkout e aproveite o melhor da tecnologia e saúde com um desconto especial.'}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
              <div 
                className={`relative bg-white/5 border-2 border-dashed px-10 py-6 rounded-2xl backdrop-blur-md transition-all duration-500
                  ${copied ? 'border-accent-400 bg-accent-500/20 scale-110 shadow-[0_0_40px_rgba(245,158,11,0.2)]' : 'border-white/20'}`}
              >
                 <span className="text-[10px] text-brand-300 font-black uppercase tracking-widest block mb-1">Cupom Ativo:</span>
                 <div className="flex items-center gap-3">
                    <span className="text-3xl font-black text-white tracking-[0.2em]">PRIMEIRA10</span>
                    {copied && <Check className="w-6 h-6 text-accent-400 animate-bounce" />}
                 </div>
              </div>

              {!copied ? (
                <Button 
                  onClick={handleCopy}
                  className="bg-white hover:bg-brand-50 text-brand-950! group px-12 py-6 rounded-2xl h-auto text-sm font-black uppercase tracking-widest shadow-xl transition-all"
                >
                   Copiar Cupom
                </Button>
              ) : (
                <div className="flex items-center gap-3 bg-accent-500 text-white px-10 py-6 rounded-2xl font-black uppercase tracking-widest animate-fade-in shadow-2xl shadow-brand-950/40">
                   <Check className="w-5 h-5" strokeWidth={4} /> Copiado com Sucesso
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 pt-8 opacity-40">
               <div className="flex items-center gap-2 text-white/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Válido hoje</span>
               </div>
               <div className="flex items-center gap-2 text-white/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Tecnologia & Saúde</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          100% { transform: translateX(200%); }
        }
      `}</style>
    </section>
  );
};
