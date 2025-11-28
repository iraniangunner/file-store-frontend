"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Pagination } from "@heroui/react";

interface PaginationWrapperProps {
  currentPage: number;
  totalPages: number;
}

export default function PaginationWrapper({ currentPage, totalPages }: PaginationWrapperProps) {
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

  return (
    <div className="flex justify-center mt-8">
      <Pagination
        total={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        showControls
        size="lg"
      />
    </div>
  );
}