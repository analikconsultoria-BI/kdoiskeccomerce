import * as React from "react";
import { Lock, Truck, CreditCard, RefreshCw } from "lucide-react";

interface TrustBadgesProps {
  variant?: "banner" | "card";
  className?: string;
}

export const TrustBadges = ({ variant = "banner", className = "" }: TrustBadgesProps) => {
  const badges = [
    { icon: Lock, title: "Compra 100% Segura", short: "Compra Segura" },
    { icon: Truck, title: "Frete para todo Brasil", short: "Envio Nacional" },
    { icon: CreditCard, title: "Parcele em até 10x", short: "Até 10x sem juros" },
    { icon: RefreshCw, title: "30 dias para trocar", short: "Troca Facilitada" },
  ];

  if (variant === "card") {
    return (
      <div className={`bg-brand-50 rounded-2xl p-5 grid grid-cols-2 gap-4 border border-brand-100/40 ${className}`}>
        {badges.map((badge, index) => (
          <div key={index} className="flex items-center gap-2.5">
            <div className="bg-warm-white rounded-full w-8 h-8 flex items-center justify-center shadow-sm">
              <badge.icon className="w-4 h-4 text-brand-700" strokeWidth={2} />
            </div>
            <span className="text-xs font-semibold text-brand-900">{badge.short}</span>
          </div>
        ))}
      </div>
    );
  }

  // Banner Variant
  return (
    <div className={`bg-brand-50/50 py-20 border-y border-brand-100 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
          {badges.map((badge, index) => (
            <div 
              key={index} 
              className="group flex flex-col items-center text-center space-y-5"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-brand-200/50 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
                <div className="relative bg-white rounded-3xl w-16 h-16 flex items-center justify-center shadow-soft border border-brand-100/50 group-hover:border-brand-200 transition-all duration-300">
                  <badge.icon className="w-7 h-7 text-brand-600" strokeWidth={1.5} />
                </div>
              </div>
              <div className="space-y-1">
                <span className="block text-sm font-bold text-brand-950 uppercase tracking-wider">{badge.short}</span>
                <p className="text-xs text-brand-400 font-medium">{badge.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
