"use client";

import { motion } from "framer-motion";
import { Package, Search, RotateCcw, Sparkles } from "lucide-react";

export default function EmptyState() {

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 via-white to-violet-50/30 border-2 border-dashed border-slate-200 p-12 sm:p-16"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-violet-100/40 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-sky-100/40 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative flex flex-col items-center text-center">
        {/* Icon */}
        <div className="relative mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
              delay: 0.1,
            }}
            className="w-24 h-24 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shadow-xl shadow-slate-200/50"
          >
            <Package className="w-10 h-10 text-slate-400" />
          </motion.div>

          {/* Floating sparkles */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute -top-2 -right-2"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-violet-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Search className="w-4 h-4 text-white" />
            </div>
          </motion.div>
        </div>

        {/* Text */}
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3"
        >
          No products found
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-slate-500 max-w-md mb-8 leading-relaxed"
        >
          We couldn&apos;t find any products matching your criteria. Try
          adjusting your filters or search query.
        </motion.p>
      </div>
    </motion.div>
  );
}
