import { Input, Button } from "@heroui/react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export function SearchBar({ value, onChange, onClear }: SearchBarProps) {
  return (
    <div className="flex-1 max-w-2xl">
      <Input
        placeholder="Search products..."
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
        size="lg"
        startContent={<Search className="w-5 h-5" />}
        endContent={
          value && (
            <Button isIconOnly size="sm" variant="light" onPress={onClear}>
              <X className="w-4 h-4" />
            </Button>
          )
        }
        classNames={{ input: "text-base", inputWrapper: "shadow-sm" }}
      />
    </div>
  );
}
