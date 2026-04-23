import * as React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "warning" | "success" | "neutral" | "orange";
  size?: "sm" | "md";
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = "", variant = "primary", size = "sm", children, ...props }, ref) => {
    
    // Badges com gradientes sutis para dimensionalidade
    const variants = {
      primary: "bg-linear-to-b from-brand-600 to-brand-700 text-white shadow-sm",
      warning: "bg-linear-to-b from-accent-400 to-accent-500 text-brand-950 shadow-sm",
      orange: "bg-linear-to-b from-orange-500 to-orange-600 text-white shadow-sm",
      success: "bg-linear-to-b from-green-500 to-green-600 text-white shadow-sm",
      neutral: "bg-warm-100 text-warm-700 border border-warm-200",
    };

    const sizes = {
      sm: "text-[11px] px-2.5 py-1",
      md: "text-sm px-3 py-1.5",
    };

    const classes = `inline-flex font-bold rounded-full tracking-wide ${variants[variant]} ${sizes[size]} ${className}`;

    return (
      <span ref={ref} className={classes} {...props}>
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";
