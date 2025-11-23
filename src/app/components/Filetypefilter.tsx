import { CheckboxGroup, Checkbox } from "@heroui/react";
import { File } from "lucide-react";

interface FileTypeFilterProps {
  fileTypes: string[];
  selectedFileTypes: string[];
  onFileTypeChange: (types: string[]) => void;
}

export function FileTypeFilter({
  fileTypes,
  selectedFileTypes,
  onFileTypeChange,
}: FileTypeFilterProps) {
  return (
    <div className="mb-4">
      <h4 className="font-medium mb-3 flex items-center gap-2">
        <File className="w-4 h-4 text-primary" /> File Types
      </h4>

      <CheckboxGroup value={selectedFileTypes} onValueChange={onFileTypeChange}>
        <div className="flex flex-col gap-2">
          {fileTypes.map((ft: any) => (
            <Checkbox key={ft.type} value={ft.type}>
              {ft.type.toUpperCase()}
            </Checkbox>
          ))}
        </div>
      </CheckboxGroup>
    </div>
  );
}
