"use client";

import { motion } from "framer-motion";

interface ProductsHeaderProps {
  productsCount: number;
}

export default function ProductsHeader({ productsCount }: ProductsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/60">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Products
          </h2>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="inline-flex items-center justify-center px-3 py-1 bg-gradient-to-r from-violet-500 to-violet-600 text-white text-sm font-bold rounded-full shadow-lg shadow-violet-500/25"
          >
            {productsCount}
          </motion.div>
        </div>
      </div>

      {productsCount > 0 && (
        <p className="text-sm text-slate-500">
          Showing <span className="font-medium text-slate-700">{productsCount}</span> result{productsCount !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
