import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", fullWidth, children, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center rounded-2xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";
    
    const variants = {
      primary: "bg-accent-500 text-white shadow-sm shadow-accent-500/10 hover:bg-accent-600 hover:shadow-lg focus:ring-2 focus:ring-accent-200 focus:ring-offset-2",
      secondary: "bg-white border border-warm-200 text-warm-900 hover:bg-warm-50 hover:border-warm-300 shadow-sm focus:ring-2 focus:ring-warm-100 focus:ring-offset-2",
      ghost: "bg-transparent text-brand-700 font-bold hover:bg-brand-50",
      danger: "bg-error text-white focus:ring-2 focus:ring-error focus:ring-offset-2",
      success: "bg-success text-white focus:ring-2 focus:ring-success focus:ring-offset-2",
      outline: "bg-transparent border-2 border-brand-700 text-brand-700 hover:bg-brand-50 font-bold",
    };

    const sizes = {
      sm: "px-4 py-2 text-xs",
      md: "px-6 py-3 text-sm",
      lg: "px-8 py-4 text-base",
    };

    const widthClass = fullWidth ? "w-full" : "";

    const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`;

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
