"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input, Button } from "@heroui/react";
import { Search } from "lucide-react";

interface BlogSearchProps {
  initialSearch: string;
}

export default function BlogSearch({ initialSearch }: BlogSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(initialSearch);

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (searchValue) {
      params.set("search", searchValue);
    } else {
      params.delete("search");
    }
    
    // Reset to page 1 when searching
    params.delete("page");
    
    router.push(`/blog?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <Input
          placeholder="Search articles..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleKeyDown}
          startContent={<Search className="w-5 h-5 text-gray-400" />}
          classNames={{
            input: "text-base",
            inputWrapper: "h-12",
          }}
        />
      </div>
      <Button
        color="primary"
        className="h-12 px-8"
        onPress={handleSearch}
      >
        Search
      </Button>
    </div>
  );
}
