"use client";

import * as React from "react";
import Link from "next/link";
import { MapPin, Mail, Phone, ShieldCheck, ShoppingCart } from "lucide-react";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

export const Footer = () => {
  const [categories, setCategories] = React.useState<any[]>([]);
  const [configs, setConfigs] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    Promise.all([
      fetch('/api/categorias', { cache: 'no-store' }).then(res => res.json()),
      fetch('/api/config', { cache: 'no-store' }).then(res => res.json())
    ]).then(([catData, configData]) => {
      if (Array.isArray(catData)) {
        setCategories(catData);
      }
      if (configData && !configData.error) {
        setConfigs(configData);
      }
    }).catch(err => console.error(err));
  }, []);

  return (
    <footer className="bg-brand-50/50 pt-24 pb-12 px-4 border-t border-brand-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-20">
          {/* Col 1 — Marca */}
          <div className="space-y-6">
            <Link href="/" className="inline-flex flex-col group">
              <span className="text-2xl font-black text-brand-900 tracking-tight">KdoisK</span>
              <span className="text-[10px] font-bold text-accent-600 tracking-[0.2em] uppercase mt-1">Health & Technology</span>
            </Link>
            <p className="text-warm-500 text-sm leading-relaxed max-w-xs">
              Especialistas em soluções que facilitam sua rotina. Do cuidado auditivo à segurança residencial, tecnologia que resolve com confiança.
            </p>
            <div className="flex flex-wrap gap-4 text-brand-400 text-sm font-semibold">
              {configs.instagram_url && (
                <a href={configs.instagram_url} target="_blank" rel="noopener noreferrer" className="hover:text-brand-700 transition-colors flex items-center gap-1">
                  <InstagramIcon className="w-4 h-4" /> Instagram
                </a>
              )}
              {configs.facebook_url && (
                <a href={configs.facebook_url} target="_blank" rel="noopener noreferrer" className="hover:text-brand-700 transition-colors flex items-center gap-1">
                  <FacebookIcon className="w-4 h-4" /> Facebook
                </a>
              )}
              {configs.shopee_url && (
                <a href={configs.shopee_url} target="_blank" rel="noopener noreferrer" className="hover:text-[#EE4D2D] transition-colors flex items-center gap-1">
                  <ShoppingCart className="w-4 h-4" /> Shopee
                </a>
              )}
              {configs.mercadolivre_url && (
                <a href={configs.mercadolivre_url} target="_blank" rel="noopener noreferrer" className="hover:text-[#F3E100] transition-colors flex items-center gap-1 text-slate-600">
                  <ShoppingCart className="w-4 h-4" /> Mercado Livre
                </a>
              )}
            </div>
          </div>

          {/* Col 2 — Linhas de Produto */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-brand-900 mb-6">Categorias</h4>
            <ul className="space-y-4 text-warm-600 text-sm font-medium">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <li key={cat.id}>
                    <Link href={cat.link} className="hover:text-brand-700 transition-colors">
                      {cat.nome}
                    </Link>
                  </li>
                ))
              ) : (
                <li><Link href="/loja" className="hover:text-brand-700 transition-colors">Ver Loja</Link></li>
              )}
            </ul>
          </div>

          {/* Col 3 — Suporte */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-brand-900 mb-6">Suporte</h4>
            <ul className="space-y-4 text-warm-600 text-sm font-medium">
              <li><Link href="/sobre" className="hover:text-brand-700 transition-colors">Sobre a KdoisK</Link></li>
              <li><a href="#" className="hover:text-brand-700 transition-colors">Privacidade</a></li>
              <li><a href="#" className="hover:text-brand-700 transition-colors">Trocas e Garantia</a></li>
              <li><a href="#" className="hover:text-brand-700 transition-colors">Fale com Especialista</a></li>
            </ul>
          </div>

          {/* Col 4 — Contato */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-brand-900 mb-6">Contato</h4>
            <ul className="space-y-5">
              <li className="flex items-center gap-3 text-accent-600 font-extrabold text-lg">
                <Phone className="w-5 h-5" /> {configs.whatsapp_suporte || '(11) 99999-9999'}
              </li>
              <li className="flex items-center gap-3 text-warm-500 text-sm font-medium">
                <Mail className="w-4 h-4 text-brand-400" /> {configs.email_contato || 'contato@kdoisk.com.br'}
              </li>
              <li className="flex items-center gap-3 text-warm-500 text-sm font-medium">
                <MapPin className="w-4 h-4 text-brand-400" /> Atendimento Nacional
              </li>
            </ul>
          </div>
        </div>

        {/* Info & Trust */}
        <div className="pt-10 border-t border-brand-100 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-wrap justify-center gap-4 opacity-70 grayscale">
            {["VISA", "MASTERCARD", "PIX", "BOLETO"].map(pay => (
              <span key={pay} className="text-[10px] font-black tracking-widest border border-brand-200 px-2.5 py-1 rounded-lg text-brand-400">{pay}</span>
            ))}
          </div>

          <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl border border-brand-100 shadow-sm">
            <ShieldCheck className="w-5 h-5 text-accent-600" />
            <span className="text-[10px] font-black text-brand-900 uppercase tracking-[0.2em]">Compra 100% Protegida</span>
          </div>

          <div className="text-center md:text-right">
            <p className="text-warm-400 text-[10px] uppercase font-bold tracking-widest">&copy; {new Date().getFullYear()} KdoisK. Resolvemos para você.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
