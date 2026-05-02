"use client";

import * as React from "react";
import Link from "next/link";
import { 
  MapPin, Mail, Phone, ShieldCheck, ShoppingCart, 
  Truck, RotateCcw, Headphones, CreditCard, Lock 
} from "lucide-react";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
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
      if (Array.isArray(catData)) setCategories(catData);
      if (configData && !configData.error) setConfigs(configData);
    }).catch(console.error);
  }, []);

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      {/* ── Trust Bar ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <TrustItem icon={Truck} title="Entrega Rápida" subtitle="Para todo o Brasil" />
            <TrustItem icon={RotateCcw} title="Troca Garantida" subtitle="30 dias de garantia" />
            <TrustItem icon={Lock} title="Compra Segura" subtitle="SSL e dados protegidos" />
            <TrustItem icon={Headphones} title="Suporte Humano" subtitle="Atendimento em horário comercial" />
          </div>
        </div>
      </div>

      {/* ── Main Footer Content ── */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-6">

          {/* Col 1 — Brand (wider) */}
          <div className="md:col-span-4 space-y-5">
            <Link href="/" className="inline-flex flex-col group">
              <span className="text-2xl font-bold text-gray-900 tracking-tight">KdoisK</span>
              <span className="text-[10px] font-bold text-brand-600 tracking-wider uppercase mt-0.5">Health & Technology</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Especialistas em soluções que facilitam sua rotina. Do cuidado auditivo à segurança residencial, tecnologia que resolve com confiança.
            </p>
            <div className="flex items-center gap-4">
              {configs.instagram_url && (
                <a href={configs.instagram_url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 text-gray-500 hover:bg-brand-600 hover:text-white transition-all">
                  <InstagramIcon className="w-4 h-4" />
                </a>
              )}
              {configs.facebook_url && (
                <a href={configs.facebook_url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 text-gray-500 hover:bg-brand-600 hover:text-white transition-all">
                  <FacebookIcon className="w-4 h-4" />
                </a>
              )}
              {configs.shopee_url && (
                <a href={configs.shopee_url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 text-gray-500 hover:bg-[#EE4D2D] hover:text-white transition-all">
                  <ShoppingCart className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Col 2 — Categorias */}
          <div className="md:col-span-2">
            <h4 className="font-bold text-sm text-gray-900 mb-4">Categorias</h4>
            <ul className="space-y-2.5 text-gray-500 text-sm">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <li key={cat.id}>
                    <Link href={cat.link} className="hover:text-brand-600 transition-colors">{cat.nome}</Link>
                  </li>
                ))
              ) : (
                <li><Link href="/loja" className="hover:text-brand-600 transition-colors">Ver Loja</Link></li>
              )}
            </ul>
          </div>

          {/* Col 3 — Institucional */}
          <div className="md:col-span-2">
            <h4 className="font-bold text-sm text-gray-900 mb-4">Institucional</h4>
            <ul className="space-y-2.5 text-gray-500 text-sm">
              <li><Link href="/sobre" className="hover:text-brand-600 transition-colors">Sobre a KdoisK</Link></li>
              <li><Link href="/privacidade" className="hover:text-brand-600 transition-colors">Política de Privacidade</Link></li>
              <li><Link href="/termos" className="hover:text-brand-600 transition-colors">Termos de Uso</Link></li>
              <li><a href="#" className="hover:text-brand-600 transition-colors">Trocas e Devoluções</a></li>
              <li><a href="#" className="hover:text-brand-600 transition-colors">Trabalhe Conosco</a></li>
            </ul>
          </div>

          {/* Col 4 — Atendimento */}
          <div className="md:col-span-2">
            <h4 className="font-bold text-sm text-gray-900 mb-4">Atendimento</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5 text-brand-600 font-bold text-sm">
                <Phone className="w-4 h-4" />
                {configs.whatsapp_suporte || '(11) 99999-9999'}
              </li>
              <li className="flex items-center gap-2.5 text-gray-500 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                {configs.email_contato || 'contato@kdoisk.com.br'}
              </li>
              <li className="flex items-center gap-2.5 text-gray-500 text-sm">
                <MapPin className="w-4 h-4 text-gray-400" />
                Atendimento Nacional
              </li>
            </ul>
          </div>

          {/* Col 5 — Pagamento */}
          <div className="md:col-span-2">
            <h4 className="font-bold text-sm text-gray-900 mb-4">Formas de Pagamento</h4>
            <div className="flex flex-wrap gap-2">
              {["VISA", "MASTERCARD", "PIX", "BOLETO", "ELO"].map(pay => (
                <span key={pay} className="text-[10px] font-bold tracking-wide border border-gray-200 px-2.5 py-1.5 rounded-md text-gray-500 bg-white">{pay}</span>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-2 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              <span className="text-[11px] font-bold text-green-700">Compra 100% Protegida</span>
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-gray-200 bg-gray-100/50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-gray-400 text-xs">
            &copy; {new Date().getFullYear()} KdoisK — CNPJ: XX.XXX.XXX/0001-XX. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <Link href="/termos" className="hover:text-brand-600 transition-colors">Termos</Link>
            <Link href="/privacidade" className="hover:text-brand-600 transition-colors">Privacidade</Link>
            <Link href="/contato" className="hover:text-brand-600 transition-colors">Contato</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

/* ── Trust Item Component ── */
function TrustItem({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-brand-600" />
      </div>
      <div>
        <p className="text-sm font-bold text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
}
