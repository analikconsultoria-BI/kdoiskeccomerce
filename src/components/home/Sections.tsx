"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Battery, Ear, Archive, Truck, ShieldCheck, RefreshCw, Headphones, Check, ChevronLeft, ChevronRight, Stethoscope, HeartPulse, Quote } from "lucide-react";
import { SearchBar } from "../common/SearchBar";
import { ProductCard } from "../product/ProductCard";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { RatingStars } from "../common/RatingStars";

/* ═════════════════════════════════════════════════
   1.2 — HERO CLEAN
   ═════════════════════════════════════════════════ */

export const Hero = ({ banners }: { banners?: any[] }) => {
  const [slides, setSlides] = React.useState<any[]>(banners || []);
  const [loading, setLoading] = React.useState(!banners);
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  React.useEffect(() => {
    if (!banners) {
      fetch('/api/banners?local=home', { cache: 'no-store' })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setSlides(data);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [banners]);

  React.useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  if (loading) return <div className="w-full h-[300px] md:h-[450px] lg:h-[550px] bg-warm-100 animate-pulse" />;
  if (slides.length === 0) return null;

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
            className="relative w-full h-full cursor-pointer"
            onClick={() => slide.link_url && (window.location.href = slide.link_url)}
          >
            {/* Desktop Banner */}
            <div className="hidden md:block relative w-full h-full">
              <Image
                src={slide.imagem_desktop_url || slide.imagem_url}
                alt={slide.titulo || "Banner"}
                fill
                priority={index === 0}
                quality={75}
                sizes="(max-width: 768px) 0px, 100vw"
                className="object-cover"
              />
            </div>

            {/* Mobile Banner */}
            <div className="block md:hidden relative w-full h-full">
              <Image
                src={slide.imagem_mobile_url || slide.imagem_desktop_url || slide.imagem_url}
                alt={slide.titulo || "Banner"}
                fill
                priority={index === 0}
                quality={75}
                sizes="(max-width: 768px) 100vw, 0px"
                className="object-cover"
              />
            </div>
          </div>
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

export const CategoriesGrid = ({ initialCategories }: { initialCategories?: any[] }) => {
  const [categories, setCategories] = React.useState<any[]>(initialCategories || []);
  const [loading, setLoading] = React.useState(!initialCategories);

  React.useEffect(() => {
    if (!initialCategories) {
      fetch('/api/categorias', { cache: 'no-store' })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setCategories(data);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [initialCategories]);

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-3xl h-96 animate-pulse" />
            ))
          ) : (
            categories.map((category) => (
              <Link key={category.id} href={category.link}>
                <Card hoverable className="group p-0 overflow-hidden border-warm-100 flex flex-col h-full bg-white">
                  {/* Image Area */}
                  <div className="relative h-64 overflow-hidden">
                    {category.imagem ? (
                      <Image
                        src={category.imagem}
                        alt={category.nome}
                        fill
                        quality={75}
                        unoptimized={category.imagem.includes('placehold.co')}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-brand-50 flex items-center justify-center">
                        <Archive className="w-12 h-12 text-brand-200" />
                      </div>
                    )}
                  </div>

                  {/* Text Content Below */}
                  <div className="p-8 text-center flex flex-col items-center">
                    <h3 className="text-xl font-bold text-warm-900 mb-2 uppercase tracking-wide group-hover:text-brand-700 transition-colors">
                      {category.nome}
                    </h3>
                    <p className="text-xs text-warm-500 mb-6 font-medium leading-relaxed">
                      Explore nossa linha premium de produtos para {category.nome.toLowerCase()}.
                    </p>
                    <div className="w-12 h-1 bg-brand-100 mb-6 group-hover:w-20 group-hover:bg-brand-500 transition-all duration-500" />
                    <span className="text-brand-700 font-bold text-[10px] uppercase tracking-wide inline-flex items-center gap-2">
                      Ver Coleção <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

/* ═════════════════════════════════════════════════
   MAIS VENDIDOS — Fundo Neutro Clínico
   ═════════════════════════════════════════════════ */

export const FeaturedProducts = () => {
  const [products, setProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === 'left' ? -600 : 600, behavior: 'smooth' });
    }
  };

  React.useEffect(() => {
    fetch('/api/produtos', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Ordenar por mais vendidos
          const sorted = [...data].sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
          setProducts(sorted.slice(0, 8));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section id="mais-vendidos" className="py-20 px-4 bg-warm-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-warm-900 tracking-tight">Mais vendidos</h2>
            <p className="text-warm-500 font-medium italic">Os produtos que você mais confia e aprova</p>
          </div>
          <Link href="/loja" className="text-brand-600 font-bold text-sm hover:underline">
            Ver tudo →
          </Link>
        </div>

        <div className="relative group/carousel">
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white shadow-xl rounded-full hidden md:flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all -translate-x-1/2 border border-warm-100 hover:bg-brand-50 text-brand-600"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide pb-6 -mx-2 px-2 snap-x snap-mandatory"
          >
            {loading ? (
              [...Array(8)].map((_, i) => (
                <div key={i} className="shrink-0 w-[220px] md:w-[260px] bg-white rounded-2xl h-80 animate-pulse" />
              ))
            ) : (
              products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} variant="carousel" />
              ))
            )}
          </div>

          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white shadow-xl rounded-full hidden md:flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all translate-x-1/2 border border-warm-100 hover:bg-brand-50 text-brand-600"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
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

// Seções removidas por conterem dados fictícios (Testimonials, FeaturedStory)

/* ═════════════════════════════════════════════════
   LANÇAMENTOS
   ═════════════════════════════════════════════════ */

export const NewArrivals = () => {
  const [products, setProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === 'left' ? -600 : 600, behavior: 'smooth' });
    }
  };

  React.useEffect(() => {
    fetch('/api/produtos', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data.slice(4, 12));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-warm-900 tracking-tight">Novas Tecnologias</h2>
            <p className="text-warm-500 font-medium italic">Últimas adições em nossa linha de cuidados</p>
          </div>
          <Link href="/loja?sort=newest" className="text-brand-600 font-bold text-sm hover:underline">
            Ver tudo →
          </Link>
        </div>

        <div className="relative group/carousel">
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white shadow-xl rounded-full hidden md:flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all -translate-x-1/2 border border-warm-100 hover:bg-brand-50 text-brand-600"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide pb-6 -mx-2 px-2 snap-x snap-mandatory"
          >
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="shrink-0 w-[220px] md:w-[260px] bg-white rounded-2xl h-80 animate-pulse" />
              ))
            ) : (
              products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} variant="carousel" />
              ))
            )}
          </div>

          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white shadow-xl rounded-full hidden md:flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all translate-x-1/2 border border-warm-100 hover:bg-brand-50 text-brand-600"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

/* ═════════════════════════════════════════════════
   OFERTAS RECOMENDADAS — Clean Refactor
   ═════════════════════════════════════════════════ */

export const FlashDeals = () => {
  const [products, setProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [timeLeft, setTimeLeft] = React.useState({ hrs: "00", min: "00", seg: "00" });
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === 'left' ? -600 : 600, behavior: 'smooth' });
    }
  };

  React.useEffect(() => {
    fetch('/api/produtos', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data.slice(2, 10));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    const timer = setInterval(() => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const diff = endOfDay.getTime() - now.getTime();

      const hrs = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');
      const min = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
      const seg = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');

      setTimeLeft({ hrs, min, seg });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
            <span className="text-[10px] font-bold text-brand-400 uppercase tracking-wide">Encerra em</span>
            <div className="flex gap-4">
              {[
                { label: "HRS", val: timeLeft.hrs },
                { label: "MIN", val: timeLeft.min },
                { label: "SEG", val: timeLeft.seg },
              ].map((timer, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="text-3xl md:text-4xl font-bold text-white tabular-nums">{timer.val}</span>
                  <span className="text-[10px] font-bold text-warm-500 mt-1">{timer.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative group/carousel">
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 backdrop-blur-md shadow-xl rounded-full hidden md:flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all -translate-x-1/2 border border-white/10 hover:bg-white/20 text-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide pb-6 -mx-2 px-2 snap-x snap-mandatory"
          >
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="shrink-0 w-[220px] md:w-[260px] bg-white/5 rounded-2xl h-80 animate-pulse" />
              ))
            ) : (
              products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} variant="carousel" />
              ))
            )}
          </div>

          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 backdrop-blur-md shadow-xl rounded-full hidden md:flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all translate-x-1/2 border border-white/10 hover:bg-white/20 text-white"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

/* ═════════════════════════════════════════════════
   CATÁLOGO POR CATEGORIA
   ═════════════════════════════════════════════════ */

export const CategoryProductSection = ({ title, categorySlug }: { title: string, categorySlug: string }) => {
  const [products, setProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -600 : 600,
        behavior: 'smooth'
      });
    }
  };

  React.useEffect(() => {
    fetch(`/api/produtos?categoria=${encodeURIComponent(categorySlug)}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Ordenar por mais vendidos (garantia extra além da API)
          const sorted = [...data].sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
          setProducts(sorted.slice(0, 8));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [categorySlug]);

  if (!loading && products.length === 0) return null;

  return (
    <section className="py-12 px-4 bg-white border-t border-warm-100">
      <div className="max-w-7xl mx-auto">
        {/* Header da seção */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-warm-900 tracking-tight">{title}</h2>
            <p className="text-sm text-warm-500 font-medium">Soluções premium em {title.toLowerCase()}</p>
          </div>
          <Link href={`/loja?categoria=${encodeURIComponent(categorySlug)}`} className="text-sm font-bold text-brand-600 hover:underline flex items-center gap-1 group">
            Ver todos <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Carrossel */}
        <div className="relative group/carousel">
          {/* Botão esquerda */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white shadow-xl rounded-full hidden md:flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all -translate-x-1/2 border border-warm-100 hover:bg-brand-50 text-brand-600"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Lista de produtos com scroll horizontal */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide pb-6 -mx-2 px-2 snap-x snap-mandatory"
          >
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="shrink-0 w-[220px] md:w-[260px] bg-warm-50 rounded-2xl h-80 animate-pulse" />
              ))
            ) : (
              products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} variant="carousel" />
              ))
            )}
          </div>

          {/* Botão direita */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white shadow-xl rounded-full hidden md:flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all translate-x-1/2 border border-warm-100 hover:bg-brand-50 text-brand-600"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
};
