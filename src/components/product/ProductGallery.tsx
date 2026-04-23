"use client";

import * as React from "react";
import { Package } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
}

export const ProductGallery = ({ images }: ProductGalleryProps) => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.offsetWidth;
    if (width > 0) {
      const index = Math.round(scrollLeft / width);
      if (index !== activeIndex) {
        setActiveIndex(index);
      }
    }
  };

  const scrollToImage = (index: number) => {
    setActiveIndex(index);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: index * scrollRef.current.offsetWidth,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 md:gap-5 md:sticky md:top-28">
      {/* Main Container / Mobile Carousel */}
      <div className="relative aspect-square md:rounded-3xl overflow-hidden md:border border-brand-100/50 md:shadow-soft-xl group -mx-4 md:mx-0 bg-white">
        {/* Mobile Indicator (Shopee/ML Style) */}
        <div className="absolute bottom-4 right-4 z-20 md:hidden bg-black/60 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full tracking-widest">
           {activeIndex + 1} / {images.length}
        </div>

        {/* Badges Overlay */}
        <div className="absolute top-5 left-5 z-20 flex flex-col gap-2 pointer-events-none">
           <span className="bg-success text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">Em Estoque</span>
           <span className="bg-white/90 backdrop-blur-md text-brand-900 border border-brand-100 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">Original KdoisK</span>
        </div>

        {/* Carousel for Mobile / Main Image for Desktop */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex md:block h-full overflow-x-auto md:overflow-hidden snap-x snap-mandatory scrollbar-hide"
        >
          {images.map((img, index) => (
            <div key={index} className="shrink-0 w-full h-full snap-center flex items-center justify-center p-8 md:p-12 relative cursor-zoom-in">
               <img 
                src={img || "/placeholder-product.png"} 
                alt={`Product view ${index}`}
                className="w-full h-full object-contain transition-all duration-700 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dots (Mobile Only) */}
      <div className="flex justify-center gap-1.5 md:hidden">
         {images.map((_, index) => (
           <div 
             key={index} 
             className={`h-1 rounded-full transition-all duration-300 ${index === activeIndex ? 'w-6 bg-brand-600' : 'w-2 bg-warm-200'}`}
           />
         ))}
      </div>

      {/* Thumbnails (Desktop Only) */}
      <div className="hidden md:grid grid-cols-5 gap-3">
        {images.map((img, index) => (
          <button
            key={index}
            className={`relative aspect-square bg-white rounded-2xl overflow-hidden border-2 transition-all duration-300
              ${index === activeIndex 
                ? "border-brand-600 shadow-md ring-4 ring-brand-100" 
                : "border-brand-50 hover:border-brand-200 grayscale-0 hover:grayscale-0"
              }
            `}
            onClick={() => scrollToImage(index)}
          >
            <img 
              src={img} 
              alt={`Thumbnail ${index}`} 
              className="w-full h-full object-contain p-2"
            />
          </button>
        ))}
      </div>

      <div className="hidden md:flex items-center justify-center gap-6 pt-4 grayscale opacity-40">
         <img src="/icons/visa.svg" className="h-4 w-auto" alt="" onError={(e) => (e.currentTarget.style.display = 'none')} />
         <img src="/icons/mastercard.svg" className="h-4 w-auto" alt="" onError={(e) => (e.currentTarget.style.display = 'none')} />
         <img src="/icons/pix.svg" className="h-4 w-auto" alt="" onError={(e) => (e.currentTarget.style.display = 'none')} />
      </div>
    </div>
  );
};
