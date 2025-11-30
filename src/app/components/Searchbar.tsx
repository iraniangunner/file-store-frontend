"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchBarProps {
  initialValue?: string;
}

export default function SearchBar({ initialValue = "" }: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }

      // Only update if search value changed
      if (params.get("search") !== searchParams.get("search")) {
        params.delete("page"); // Reset to page 1
        const newUrl = params.toString() ? `${pathname}?${params}` : pathname;
        router.push(newUrl, { scroll: false });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [value, searchParams, pathname, router]);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape" && document.activeElement === inputRef.current) {
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleChange = (val: string) => {
    setValue(val);
  };

  const handleClear = () => {
    setValue("");
    inputRef.current?.focus();
  };

  return (
    <div className="relative group">
      {/* Glow effect on focus */}
      <div 
        className={`absolute -inset-1 bg-gradient-to-r from-violet-500/20 via-sky-500/20 to-violet-500/20 rounded-2xl blur-lg transition-opacity duration-500 ${
          isFocused ? "opacity-100" : "opacity-0"
        }`} 
      />
      
      <div 
        className={`relative flex items-center bg-white rounded-2xl border-2 transition-all duration-300 ${
          isFocused 
            ? "border-violet-400 shadow-xl shadow-violet-500/10" 
            : "border-slate-200 shadow-lg shadow-slate-200/50 hover:border-slate-300"
        }`}
      >
        {/* Search Icon */}
        <div className={`pl-5 transition-colors duration-300 ${
          isFocused ? "text-violet-500" : "text-slate-400"
        }`}>
          <Search className="w-5 h-5" />
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search products..."
          className="flex-1 py-4 px-4 bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none text-base"
        />

        {/* Right side */}
        <div className="flex items-center gap-2 pr-4">
          {/* Clear button */}
          <AnimatePresence>
            {value && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={handleClear}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Keyboard shortcut hint */}
          <div 
            className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 transition-all duration-300 ${
              isFocused ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
          >
            <kbd className="text-[10px] font-semibold text-slate-500">⌘</kbd>
            <kbd className="text-[10px] font-semibold text-slate-500">K</kbd>
          </div>
        </div>
      </div>

      {/* Animated underline */}
      <motion.div 
        className="absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-violet-500 to-sky-500 rounded-full"
        initial={{ width: 0, x: "-50%" }}
        animate={{ 
          width: isFocused ? "60%" : "0%",
          x: "-50%"
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
    </div>
  );
}