"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Pagination } from "@heroui/react";

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function BlogPagination({ currentPage, totalPages }: BlogPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (page > 1) {
      params.set("page", page.toString());
    } else {
      params.delete("page");
    }
    
    router.push(`/blog?${params.toString()}`);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex justify-center">
      <Pagination
        total={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        showControls
        size="lg"
        classNames={{
          wrapper: "gap-2",
          item: "w-10 h-10",
          cursor: "bg-violet-600 text-white",
        }}
      />
    </div>
  );
}
