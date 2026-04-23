import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export const Pagination = ({ currentPage, totalPages }: PaginationProps) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="py-12 flex justify-center items-center gap-2">
      <button 
        disabled={currentPage === 1}
        className="w-10 h-10 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold transition-colors
            ${page === currentPage 
              ? "bg-brand-600 text-white shadow-md" 
              : "text-gray-700 hover:bg-brand-100 hover:text-brand-900"
            }
          `}
        >
          {page}
        </button>
      ))}

      <button 
        disabled={currentPage === totalPages}
        className="w-10 h-10 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};
