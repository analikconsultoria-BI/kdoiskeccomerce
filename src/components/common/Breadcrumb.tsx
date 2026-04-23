import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string; // e.g. py-4 container
}

export const Breadcrumb = ({ items, className = "" }: BreadcrumbProps) => {
  return (
    <nav className={`flex items-center text-sm text-gray-500 ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li className="flex items-center">
          <Link href="/" className="hover:text-brand-700 transition-colors">Home</Link>
        </li>
        
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
            {item.href ? (
              <Link href={item.href} className="hover:text-brand-700 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-700 font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
