import * as React from "react";
import { Search } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  wrapperClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", icon, wrapperClassName = "", ...props }, ref) => {
    
    // Using a wrapper around input to allow icon inside
    return (
      <div className={`relative flex items-center ${wrapperClassName}`}>
        {icon && (
          <div className="absolute left-4 text-gray-400 pointer-events-none transition-colors group-focus-within:text-brand-600">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={`
            peer w-full bg-white border border-gray-300 rounded-lg text-base
            transition-colors duration-200 placeholder:text-gray-400
            focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100
            ${icon ? "pl-12 pr-4 py-3" : "px-4 py-3"}
            ${className}
          `}
          {...props}
        />
        {/* Style the icon based on input focus */}
        <style jsx>{`
          input:focus ~ div {
            color: var(--color-brand-600);
          }
        `}</style>
      </div>
    );
  }
);

Input.displayName = "Input";
