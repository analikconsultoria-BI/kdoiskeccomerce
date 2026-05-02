"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface SearchBarProps extends React.FormHTMLAttributes<HTMLFormElement> {
  placeholder?: string;
  large?: boolean;
  variant?: "default" | "glass";
}

export const SearchBarInner = ({ className = "", placeholder = "Buscar produtos...", large = false, variant = "default", ...props }: SearchBarProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = React.useState(searchParams.get("busca") || "");
  const isGlass = variant === "glass";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/loja?busca=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/loja");
    }
  };

  return (
    <form
      className={`flex w-full group ${className}`}
      onSubmit={handleSubmit}
      {...props}
    >
      <div className="flex-1 relative flex items-center">
        <div className={`absolute left-4 pointer-events-none transition-colors duration-300
          ${isGlass ? "text-brand-300 group-focus-within:text-white" : "text-warm-400 group-focus-within:text-brand-500"}`}
        >
          <Search className="w-4 h-4" />
        </div>
        <input 
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`
            w-full outline-none transition-all duration-300
            ${large ? "py-4 text-lg rounded-l-xl pl-12 pr-4" : "py-2.5 rounded-l-[10px] pl-11 pr-4 text-sm"}
            ${isGlass 
              ? "bg-white/8 backdrop-blur-md border border-white/15 text-white placeholder:text-brand-300/60 focus:bg-white/12 focus:border-white/30" 
              : "bg-white border border-warm-200 text-warm-900 placeholder:text-warm-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-50/50"
            }
          `}
        />
      </div>
      <button 
        type="submit"
        className={`bg-brand-700 text-white font-bold flex items-center justify-center hover:bg-brand-800 transition-all
        ${large ? "px-8 py-4 text-lg rounded-r-xl" : "px-5 py-2.5 rounded-r-[10px] text-sm"}`}
      >
        Buscar
      </button>
    </form>
  );
};

export const SearchBar = (props: SearchBarProps) => {
  return (
    <Suspense fallback={<div className={`flex w-full group ${props.className || ""}`}><div className={`w-full bg-warm-100 animate-pulse ${props.large ? "h-14 rounded-xl" : "h-10 rounded-[10px]"}`}></div></div>}>
      <SearchBarInner {...props} />
    </Suspense>
  );
};
