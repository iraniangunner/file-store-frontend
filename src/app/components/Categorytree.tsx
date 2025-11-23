import { Checkbox } from "@heroui/react";
import { ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CategoryApi } from "@/types";

interface CategoryTreeItemProps {
  node: CategoryApi;
  isExpanded: boolean;
  onToggleExpand: (id: number) => void;
  renderChildren: (nodes: CategoryApi[]) => React.ReactNode;
}

export function CategoryTreeItem({
  node,
  isExpanded,
  onToggleExpand,
  renderChildren,
}: CategoryTreeItemProps) {
  const hasChildren = (node.children_recursive || []).length > 0;
  const isRoot = node.parent_id === null;

  return (
    <div className="mb-1">
      <div
        className="
          flex items-center justify-between
          cursor-pointer p-2 rounded-lg
          hover:bg-default-100 transition
        "
        onClick={() => hasChildren && onToggleExpand(node.id)}
      >
        <div className="flex items-center gap-2">
          {isRoot ? (
            <span className="font-semibold text-sm">{node.name}</span>
          ) : (
            <Checkbox
              value={String(node.id)}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-sm">{node.name}</span>
            </Checkbox>
          )}
        </div>

        <div className="flex items-center">
          {hasChildren ? (
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.25 }}
            >
              <ChevronRight className="w-4 h-4 text-primary" />
            </motion.div>
          ) : (
            <div className="w-4" />
          )}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="pl-4 border-l border-default-200 overflow-hidden"
          >
            <div className="mt-2">
              {renderChildren(node.children_recursive || [])}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
