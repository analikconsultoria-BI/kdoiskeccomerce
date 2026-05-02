"use client";

import * as React from "react";
import { Package, ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { createPortal } from "react-dom";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export const ProductGallery = ({ images, productName }: ProductGalleryProps) => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = React.useState(false);

  const scrollToImage = (index: number) => {
    setActiveIndex(index);
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Preload all images to avoid delay when switching
  React.useEffect(() => {
    if (images && images.length > 0) {
      images.forEach((src) => {
        const img = new (window as any).Image();
        img.src = src;
      });
    }
  }, [images]);

  // Prevent scroll when lightbox is open
  React.useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isLightboxOpen]);

  return (
    <div className="flex flex-col lg:flex-row gap-4 items-start">
      {/* Desktop Thumbnails (Left Side - Amazon Pattern) */}
      <div className={`hidden lg:flex flex-col gap-3 w-20 shrink-0 pr-1 transition-all duration-500 ${isExpanded ? 'max-h-[600px] overflow-y-auto' : 'h-auto'}`}>
        {(isExpanded ? images : images.slice(0, 6)).map((img, index) => {
          const isLastVisible = !isExpanded && index === 5 && images.length > 6;
          const remainingCount = images.length - 5;

          return (
            <button
              key={index}
              className={`relative aspect-square bg-white rounded-2xl overflow-hidden border-2 transition-all duration-300 shrink-0
                ${index === activeIndex 
                  ? "border-brand-600 shadow-md ring-4 ring-brand-100" 
                  : "border-brand-50 hover:border-brand-200"
                }
              `}
              onMouseEnter={() => !isLastVisible && scrollToImage(index)}
              onClick={() => {
                setActiveIndex(index);
                setIsLightboxOpen(true);
              }}
            >
              <div className="relative aspect-square w-full overflow-hidden">
                <Image 
                  src={img} 
                  alt={`${productName} - ${index + 1}`} 
                  fill
                  sizes="120px"
                  className="object-contain p-2"
                  quality={75}
                  priority={false}
                  loading="lazy"
                  unoptimized={img.includes('placehold.co')}
                />
                {isLastVisible && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex flex-col items-center justify-center text-white font-black pointer-events-none">
                    <span className="text-lg">+{remainingCount}</span>
                    <span className="text-[8px] uppercase tracking-tighter">Ver mais</span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Main Image Container — w-full and aspect-square for mobile */}
        <div 
          className="relative w-full aspect-square flex items-center justify-center overflow-hidden rounded-2xl bg-white border border-gray-100 group cursor-zoom-in"
          onClick={() => setIsLightboxOpen(true)}
        >
          {/* Mobile Indicator */}
          {images.length > 1 && (
            <div className="absolute bottom-4 right-4 z-20 lg:hidden bg-black/60 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full tracking-widest">
              {activeIndex + 1} / {images.length}
            </div>
          )}

          <div className="relative w-full h-full overflow-hidden">
            <Image 
              key={activeIndex}
              src={images[activeIndex] || 'https://placehold.co/400x400/f9f9f9/cccccc?text=Sem+Imagem'} 
              alt={productName}
              fill
              className="object-contain p-4 transition-all duration-300 ease-out group-hover:scale-105 animate-in fade-in duration-300"
              quality={75}
              priority={true}
              unoptimized={!images[activeIndex] || images[activeIndex].includes('placehold.co')}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 55vw, 700px"
            />
          </div>
        </div>

        {/* Lightbox Modal */}
        {isLightboxOpen && typeof document !== "undefined" && createPortal(
          <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
            {/* Close Button */}
            <button 
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all z-110"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-6 p-4 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all z-110"
                >
                  <ChevronLeft className="w-10 h-10" />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-6 p-4 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all z-110"
                >
                  <ChevronRight className="w-10 h-10" />
                </button>
              </>
            )}

            {/* Main Image in Lightbox */}
            <div className="relative w-full h-[70vh] flex items-center justify-center px-4">
              <Image 
                src={images[activeIndex]} 
                alt={productName}
                fill
                className="object-contain animate-in zoom-in-95 duration-500"
                quality={100}
                priority
              />
            </div>

            {/* Thumbnails in Lightbox */}
            <div className="mt-8 flex gap-2 overflow-x-auto max-w-[90vw] p-4 scrollbar-hide">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`relative shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300
                    ${index === activeIndex ? "border-brand-500 scale-110 shadow-lg" : "border-white/10 opacity-50 hover:opacity-100"}
                  `}
                >
                  <Image src={img} alt={`Thumb ${index}`} fill className="object-cover" sizes="64px" />
                </button>
              ))}
            </div>
          </div>,
          document.body
        )}

        {/* Mobile Thumbnails (Horizontal below image) */}
        <div className="lg:hidden flex gap-2 overflow-x-auto snap-x scrollbar-hide py-3">
          {(isExpanded ? images : images.slice(0, 6)).map((img, index) => {
            const isLastVisible = !isExpanded && index === 5 && images.length > 6;
            const remainingCount = images.length - 5;

            return (
              <button
                key={index}
                className={`relative shrink-0 w-16 h-16 bg-white rounded-2xl overflow-hidden border-2 transition-all duration-300 snap-center
                  ${index === activeIndex 
                    ? "border-brand-600 shadow-md ring-4 ring-brand-100" 
                    : "border-brand-50"
                  }
                `}
                onClick={() => {
                  setActiveIndex(index);
                  setIsLightboxOpen(true);
                }}
              >
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image 
                    src={img} 
                    alt={`${productName} - ${index + 1}`} 
                    fill
                    sizes="120px"
                    className="object-contain p-2"
                    quality={75}
                    priority={false}
                    loading="lazy"
                    unoptimized={img.includes('placehold.co')}
                  />
                  {isLastVisible && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex flex-col items-center justify-center text-white font-black pointer-events-none">
                      <span className="text-sm">+{remainingCount}</span>
                      <span className="text-[6px] uppercase tracking-tighter">Fotos</span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
