"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationWrapperProps {
  currentPage: number;
  totalPages: number;
}

export default function PaginationWrapper({
  currentPage,
  totalPages,
}: PaginationWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (page > 1) {
      params.set("page", String(page));
    } else {
      params.delete("page");
    }

    const newUrl = params.toString() ? `${pathname}?${params}` : pathname;
    router.push(newUrl);
  };

  // Generate visible page numbers
  const getVisiblePages = () => {
    const delta = 1; // Pages to show on each side of current
    const pages: (number | "ellipsis-start" | "ellipsis-end")[] = [];

    // Always show first page
    pages.push(1);

    // Calculate range around current page
    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

    // Add ellipsis after first page if needed
    if (rangeStart > 2) {
      pages.push("ellipsis-start");
    }

    // Add pages in range
    for (let i = rangeStart; i <= rangeEnd; i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    // Add ellipsis before last page if needed
    if (rangeEnd < totalPages - 1) {
      pages.push("ellipsis-end");
    }

    // Always show last page (if more than 1 page)
    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages;
  };

  const PageButton = ({
    page,
    isActive,
    onClick,
    disabled,
    children,
    className = "",
  }: {
    page?: number;
    isActive?: boolean;
    onClick: () => void;
    disabled?: boolean;
    children: React.ReactNode;
    className?: string;
  }) => (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={`
        relative flex items-center justify-center transition-all duration-200
        ${className}
        ${disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"}
        ${isActive
          ? "bg-gradient-to-br from-violet-500 to-violet-600 text-white shadow-lg shadow-violet-500/30"
          : disabled
            ? "text-slate-300"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }
      `}
    >
      {children}
    </motion.button>
  );

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-8">
      {/* Page info */}
      <div className="flex items-center gap-2 text-sm text-slate-500 order-2 sm:order-1">
        <span>Page</span>
        <span className="inline-flex items-center justify-center min-w-[2rem] h-7 px-2 bg-slate-100 text-slate-900 font-semibold rounded-lg">
          {currentPage}
        </span>
        <span>of {totalPages}</span>
      </div>

      {/* Pagination controls */}
      <nav
        className="inline-flex items-center gap-1 p-1.5 bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/60 order-1 sm:order-2"
        aria-label="Pagination"
      >
        {/* First page button */}
        <PageButton
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className="w-9 h-9 rounded-xl hidden sm:flex"
        >
          <ChevronsLeft className="w-4 h-4" />
        </PageButton>

        {/* Previous button */}
        <PageButton
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-9 h-9 rounded-xl"
        >
          <ChevronLeft className="w-4 h-4" />
        </PageButton>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-200 mx-1" />

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {getVisiblePages().map((page, index) => {
            if (page === "ellipsis-start" || page === "ellipsis-end") {
              return (
                <span
                  key={page}
                  className="w-9 h-9 flex items-center justify-center text-slate-400"
                >
                  <span className="tracking-widest">···</span>
                </span>
              );
            }

            return (
              <PageButton
                key={page}
                page={page}
                isActive={page === currentPage}
                onClick={() => handlePageChange(page)}
                className="w-9 h-9 rounded-xl text-sm font-semibold"
              >
                {page}
              </PageButton>
            );
          })}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-200 mx-1" />

        {/* Next button */}
        <PageButton
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-9 h-9 rounded-xl"
        >
          <ChevronRight className="w-4 h-4" />
        </PageButton>

        {/* Last page button */}
        <PageButton
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="w-9 h-9 rounded-xl hidden sm:flex"
        >
          <ChevronsRight className="w-4 h-4" />
        </PageButton>
      </nav>
    </div>
  );
}