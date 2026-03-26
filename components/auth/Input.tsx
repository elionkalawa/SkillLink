import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {label}
        </label>
        <input
          ref={ref}
          className={`
            w-full px-4 py-2 text-gray-900 bg-white dark:bg-gray-800 dark:text-gray-100 
            border rounded-lg outline-none transition-all duration-200 ease-in-out
            focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
            ${error ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : "border-gray-300 dark:border-gray-600"}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
