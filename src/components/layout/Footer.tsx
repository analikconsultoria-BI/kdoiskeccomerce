import * as React from "react";
import Link from "next/link";
import { MapPin, Mail, Phone, ShieldCheck } from "lucide-react";

export const Footer = () => {
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
            <div className="flex gap-4 text-brand-400 text-sm font-semibold">
              {["Facebook", "Instagram", "LinkedIn"].map(social => (
                <a key={social} href="#" className="hover:text-brand-700 transition-colors">{social}</a>
              ))}
            </div>
          </div>

          {/* Col 2 — Linhas de Produto */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-brand-900 mb-6">Categorias</h4>
            <ul className="space-y-4 text-warm-600 text-sm font-medium">
              <li><Link href="/loja" className="hover:text-brand-700 transition-colors">Aparelhos Auditivos</Link></li>
              <li><Link href="/loja" className="hover:text-brand-700 transition-colors">Pilhas e Baterias</Link></li>
              <li><Link href="/loja" className="hover:text-brand-700 transition-colors">Segurança & Fechaduras</Link></li>
              <li><Link href="/loja" className="hover:text-brand-700 transition-colors">Acessórios de Saúde</Link></li>
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
                <Phone className="w-5 h-5" /> (11) 99999-9999
              </li>
              <li className="flex items-center gap-3 text-warm-500 text-sm font-medium">
                <Mail className="w-4 h-4 text-brand-400" /> contato@kdoisk.com.br
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
