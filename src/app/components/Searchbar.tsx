// import { Input, Button } from "@heroui/react";
// import { Search, X } from "lucide-react";

// interface SearchBarProps {
//   value: string;
//   onChange: (value: string) => void;
//   onClear: () => void;
// }

// export function SearchBar({ value, onChange, onClear }: SearchBarProps) {
//   return (
//     <div className="flex-1 max-w-2xl">
//       <Input
//         placeholder="Search products..."
//         value={value}
//         onChange={(e) => onChange(e.currentTarget.value)}
//         size="lg"
//         startContent={<Search className="w-5 h-5" />}
//         endContent={
//           value && (
//             <Button isIconOnly size="sm" variant="light" onPress={onClear}>
//               <X className="w-4 h-4" />
//             </Button>
//           )
//         }
//         classNames={{ input: "text-base", inputWrapper: "shadow-sm" }}
//       />
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Input } from "@heroui/react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  initialValue?: string;
}

export default function SearchBar({ initialValue = "" }: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [value, setValue] = useState(initialValue);

  // Use useEffect to handle the debounced update with current searchParams
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

  const handleChange = (val: string) => {
    setValue(val);
  };

  const handleClear = () => {
    setValue("");
  };

  return (
    <Input
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      placeholder="Search products..."
      startContent={<Search className="w-4 h-4" />}
      endContent={
        value && (
          <button onClick={handleClear}>
            <X className="w-4 h-4" />
          </button>
        )
      }
      className="flex-1"
    />
  );
}
