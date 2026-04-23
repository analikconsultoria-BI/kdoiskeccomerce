import * as React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", hoverable = false, children, ...props }, ref) => {
    
    const baseClass = [
      "bg-[var(--color-warm-white)]",
      "border border-brand-100/60",
      "rounded-2xl",
      "p-6",
      "transition-all duration-300",
      "shadow-[var(--shadow-card)]",
    ].join(" ");
    
    const hoverClass = hoverable 
      ? "hover:border-brand-200 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1 cursor-pointer" 
      : "";

    return (
      <div ref={ref} className={`${baseClass} ${hoverClass} ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
