"use client";

import * as React from "react";
import Link from "next/link";
import { Battery, Ear, Archive, Truck, ShieldCheck, RefreshCw, Headphones, Check, ChevronLeft, ChevronRight, Stethoscope, HeartPulse, Quote } from "lucide-react";
import { SearchBar } from "../common/SearchBar";
import { mockCategories, mockProducts, mockReviews } from "@/lib/mockData";
import { ProductCard } from "../product/ProductCard";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { RatingStars } from "../common/RatingStars";

/* ═════════════════════════════════════════════════
   1.2 — HERO CLEAN
   ═════════════════════════════════════════════════ */

export const Hero = () => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  const slides = [
    { image: "/banners/1.png" },
    { image: "/banners/2.png" },
    { image: "/banners/3.png" },
  ];

  React.useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  return (
    <section
      className="relative w-full h-[300px] md:h-[450px] lg:h-[550px] overflow-hidden bg-warm-50"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out
            ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}
          `}
        >
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
        </div>
      ))}

      {/* Navegação Clean */}
      <button
        className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-2 text-warm-900 bg-white/40 hover:bg-white/80 rounded-full transition-all backdrop-blur-sm border border-white/50"
        onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-2 text-warm-900 bg-white/40 hover:bg-white/80 rounded-full transition-all backdrop-blur-sm border border-white/50"
        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicadores Minimalistas */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 rounded-full
              ${index === currentSlide ? "w-8 h-1.5 bg-brand-500" : "w-1.5 h-1.5 bg-warm-300 hover:bg-warm-400"}`}
          />
        ))}
      </div>
    </section>
  );
};

/* ═════════════════════════════════════════════════
   CATEGORIAS GRID — Fundo Branco Puro
   ═════════════════════════════════════════════════ */

export const CategoriesGrid = () => {
  return (
    <section className="py-20 md:py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-warm-900 mb-4 tracking-tight">
            Cuidado e Saúde em cada detalhe
          </h2>
          <p className="text-lg text-warm-500 max-w-2xl mx-auto">
            Selecione uma categoria para encontrar as melhores soluções em audição e energia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mockCategories.map((category) => (
            <Link key={category.id} href={`/loja?categoria=${category.slug}`}>
              <Card hoverable className="h-full group p-0 overflow-hidden border-warm-100 odd:bg-warm-50/30">
                <div className="w-full aspect-4/3 overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-warm-900 mb-2">{category.name}</h3>
                  <p className="text-sm text-warm-500 mb-6 leading-relaxed">{category.description}</p>
                  <span className="text-brand-600 font-bold text-sm inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Ver produtos <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ═════════════════════════════════════════════════
   MAIS VENDIDOS — Fundo Neutro Clínico
   ═════════════════════════════════════════════════ */

export const FeaturedProducts = () => {
  const featured = mockProducts.slice(0, 8);

  return (
    <section id="mais-vendidos" className="py-20 md:py-24 px-4 bg-warm-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-warm-900 mb-2">Populares agora</h2>
            <p className="text-warm-500">As escolhas favoritas dos nossos clientes</p>
          </div>
          <Link href="/loja" className="text-brand-600 font-bold text-sm hover:text-brand-700">
            Ver catálogo completo →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

/* ═════════════════════════════════════════════════
   BENEFÍCIOS — Minimalismo Puro
   ═════════════════════════════════════════════════ */

export const Benefits = () => {
  const benefits = [
    { icon: Truck, title: "Envio Seguro", desc: "Entrega discreta e ágil" },
    { icon: ShieldCheck, title: "Qualidade Médica", desc: "Produtos certificados" },
    { icon: RefreshCw, title: "30 Dias de Teste", desc: "Garantia de adaptação" },
    { icon: HeartPulse, title: "Suporte Técnico", desc: "Especialistas à disposição" },
  ];

  return (
    <section className="py-24 px-4 bg-white border-y border-warm-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {benefits.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center group">
              <div className="bg-warm-50 rounded-2xl w-16 h-16 flex items-center justify-center mb-6 border border-warm-100 group-hover:bg-brand-50 transition-colors">
                <item.icon className="w-7 h-7 text-brand-500" strokeWidth={1.5} />
              </div>
              <h4 className="text-base font-bold text-warm-900 mb-2">{item.title}</h4>
              <p className="text-xs text-warm-500 leading-relaxed max-w-[140px] mx-auto">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ═════════════════════════════════════════════════
   DEPOIMENTOS — Clean & Trust
   ═════════════════════════════════════════════════ */

export const Testimonials = () => {
  const testimonials = mockReviews.slice(0, 3);

  return (
    <section className="py-24 px-4 bg-warm-50/50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-warm-900 text-center mb-16 tracking-tight">
          Confiança de quem já usa
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((review) => (
            <Card key={review.id} className="bg-white border-warm-100/50 shadow-sm flex flex-col gap-5 p-8">
              <RatingStars rating={review.rating} size={16} />
              <p className="text-warm-600 italic text-[15px] leading-relaxed">
                &ldquo;{review.content}&rdquo;
              </p>
              <div className="pt-4 border-t border-warm-50 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-warm-100 flex items-center justify-center font-bold text-warm-600 text-sm">
                  {review.author.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-warm-900 text-sm">{review.author}</div>
                  <div className="text-[10px] text-accent-600 flex items-center gap-1 font-black uppercase tracking-widest">
                    <Check className="w-3 h-3" strokeWidth={3} /> Cliente Verificado
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ═════════════════════════════════════════════════
   HISTÓRIA EM DESTAQUE (FEAT. TESTIMONIAL)
   ═════════════════════════════════════════════════ */

export const FeaturedStory = () => {
  return (
    <section className="py-24 px-4 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-100 rounded-full blur-3xl opacity-50 animate-pulse" />
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-warm-50 group">
              <img 
                src="/customers/testimonial-1.png" 
                alt="Sra. Helena"
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-brand-950/40 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-accent-500 text-white p-6 rounded-3xl shadow-xl hidden md:block">
               <div className="text-3xl font-black mb-1">100%</div>
               <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">De Proteção</div>
            </div>
          </div>
          
          <div className="flex flex-col gap-8">
            <div className="w-16 h-1.5 bg-brand-500 rounded-full" />
            <div className="space-y-6">
              <Quote className="w-12 h-12 text-brand-200 fill-brand-200/20" />
              <h2 className="text-4xl md:text-6xl font-black text-brand-950 leading-[1.1] tracking-tighter">
                "Meu aparelho nunca mais parou de funcionar."
              </h2>
              <p className="text-xl text-warm-600 leading-relaxed font-medium">
                A Sra. Helena, de 68 anos, sofria com o entupimento constante do seu aparelho. Com os nossos protetores de cera, ela garante a vida útil do seu dispositivo e evita manutenções caras.
              </p>
            </div>
            
            <div className="flex items-center gap-6 p-6 bg-brand-50 rounded-3xl border border-brand-100">
               <div className="space-y-1">
                  <div className="font-bold text-brand-950 text-lg">Sra. Helena de Oliveira</div>
                  <div className="text-xs text-brand-600 font-bold uppercase tracking-widest flex items-center gap-1">
                     <Check className="w-3.5 h-3.5" strokeWidth={3} /> Cliente KdoisK | Prot. de Cera
                  </div>
               </div>
            </div>

            <Link href="/loja">
              <Button size="lg" className="h-16 px-10 rounded-2xl text-sm font-black uppercase tracking-[0.2em] shadow-xl shadow-brand-950/20 w-fit">
                Ver Protetores de Cera
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ═════════════════════════════════════════════════
   LANÇAMENTOS
   ═════════════════════════════════════════════════ */

export const NewArrivals = () => {
  const newProducts = mockProducts.slice(4, 8);

  return (
    <section className="py-20 md:py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-warm-900 mb-2">Novas Tecnologias</h2>
            <p className="text-warm-500">Últimas adições em nossa linha de cuidados</p>
          </div>
          <Link href="/loja?sort=newest" className="text-brand-600 font-bold text-sm hover:text-brand-700">
            Explorar todas →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
          {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

/* ═════════════════════════════════════════════════
   OFERTAS RECOMENDADAS — Clean Refactor
   ═════════════════════════════════════════════════ */

export const FlashDeals = () => {
  const deals = mockProducts.slice(2, 6);

  return (
    <section className="py-24 px-4 bg-warm-900 relative overflow-hidden">
      {/* Decoração super sutil */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-10">
          <div className="max-w-lg">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Oportunidades de Bem-estar
            </h2>
            <p className="text-warm-300 text-lg leading-relaxed">
              Selecionamos ofertas exclusivas nos produtos mais essenciais para sua saúde auditiva.
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 flex flex-col items-center gap-4">
             <span className="text-[10px] font-black text-brand-400 uppercase tracking-[0.3em]">Encerra em</span>
             <div className="flex gap-4">
                {[
                  { label: "HRS", val: "08" },
                  { label: "MIN", val: "24" },
                  { label: "SEG", val: "12" },
                ].map((timer, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <span className="text-3xl md:text-4xl font-bold text-white tabular-nums">{timer.val}</span>
                    <span className="text-[10px] font-bold text-warm-500 mt-1">{timer.label}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6">
          {deals.map((product) => (
            <div key={product.id} className="relative group">
              <div className="absolute -top-1.5 -right-1.5 bg-accent-500 text-white text-[10px] font-black px-2.5 py-1 rounded-lg z-20 shadow-md">
                -20%
              </div>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
