"use client";

import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Input,
  Textarea,
  Spinner,
} from "@heroui/react";
import { Plus } from "lucide-react";
import api from "@/lib/api";

// =======================
// Types
// =======================
interface Category {
  id: number;
  name: string;
  parent_id: number | null;
}

interface CategoryTree extends Category {
  children: CategoryTree[];
}

// =======================
// Tree Builder
// =======================
function buildTree(flat: Category[]): CategoryTree[] {
  const map: Record<number, CategoryTree> = {};
  const roots: CategoryTree[] = [];

  flat.forEach((cat) => (map[cat.id] = { ...cat, children: [] }));

  flat.forEach((cat) => {
    if (cat.parent_id === null) {
      roots.push(map[cat.id]);
    } else if (map[cat.parent_id]) {
      map[cat.parent_id].children.push(map[cat.id]);
    }
  });

  return roots;
}

// =======================
// Tree Node Component
// =======================
const CategoryNode = ({
  node,
  form,
  setForm,
  expanded,
  setExpanded,
}: {
  node: CategoryTree;
  form: any;
  setForm: any;
  expanded: Record<number, boolean>;
  setExpanded: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
}) => {
  const hasChildren = node.children.length > 0;
  const isExpanded = expanded[node.id] ?? true;

  return (
    <div className="ml-2 my-1">
      <div className="flex items-center gap-2">

        {/* toggle */}
        {hasChildren && (
          <button
            className="w-5 text-gray-600"
            onClick={() =>
              setExpanded(prev => ({ ...prev, [node.id]: !isExpanded }))
            }
          >
            {isExpanded ? "▾" : "▸"}
          </button>
        )}

        {/* ONLY LEAFS HAVE CHECKBOX */}
        {!hasChildren ? (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              value={node.id}
              checked={form.category_ids.includes(String(node.id))}
              onChange={(e) => {
                const id = String(node.id);
                setForm((p: any) => {
                  const updated = e.target.checked
                    ? [...p.category_ids, id]
                    : p.category_ids.filter((x: string) => x !== id);
                  return { ...p, category_ids: updated };
                });
              }}
            />
            {node.name}
          </label>
        ) : (
          <span className={node.parent_id === null ? "font-semibold" : ""}>
            {node.name}
          </span>
        )}
      </div>

      {/* children */}
      {hasChildren && isExpanded && (
        <div className="ml-4 border-l pl-3">
          {node.children.map((child) => (
            <CategoryNode
              key={child.id}
              node={child}
              form={form}
              setForm={setForm}
              expanded={expanded}
              setExpanded={setExpanded}
            />
          ))}
        </div>
      )}
    </div>
  );
};


// =======================
// MAIN COMPONENT
// =======================
export function CreateProductModal({
  onProductCreated,
}: {
  onProductCreated?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({}); // tree expand state

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    file: null as File | null,
    image: null as File | null,
    category_ids: [] as string[],
  });

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories", { requiresAuth: true } as any);
        setCategories(res.data.data || res.data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    if (!form.title || !form.price || !form.file) {
      alert("Please fill all required fields and upload a file.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("file", form.file);

      if (form.image) formData.append("image", form.image);

      form.category_ids.forEach((id) => {
        formData.append("category_ids[]", id);
      });

      await api.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        requiresAuth: true,
      } as any);

      setIsOpen(false);
      setForm({
        title: "",
        description: "",
        price: "",
        file: null,
        image: null,
        category_ids: [],
      });

      onProductCreated?.();
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const tree = buildTree(categories);

  return (
    <>
      <Button
        color="primary"
        startContent={<Plus size={18} />}
        onPress={() => setIsOpen(true)}
      >
        Create Product
      </Button>

      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
        <ModalContent>
          <ModalHeader>Create New Product</ModalHeader>
          <ModalBody className="flex flex-col gap-4">
            <Input
              label="Title"
              placeholder="Enter product title"
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({ ...p, title: e.target.value }))
              }
            />

            <Textarea
              label="Description"
              placeholder="Enter product description"
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
            />

            <Input
              label="Price ($)"
              type="number"
              placeholder="Enter price"
              value={form.price}
              onChange={(e) =>
                setForm((p) => ({ ...p, price: e.target.value }))
              }
            />

            {/* ==================== CATEGORY TREE ==================== */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Categories
              </label>

              <div className="max-h-60 overflow-y-auto border rounded-lg p-2">
                {tree.map((root) => (
                  <CategoryNode
                    key={root.id}
                    node={root}
                    form={form}
                    setForm={setForm}
                    expanded={expanded}
                    setExpanded={setExpanded}
                  />
                ))}
              </div>
            </div>

            {/* Product Image */}
            <div>
              <label className="text-sm font-medium mb-1 block">
                Product Image
              </label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    image: e.target.files?.[0] || null,
                  }))
                }
              />
              {form.image && (
                <img
                  src={URL.createObjectURL(form.image)}
                  className="mt-2 w-32 h-32 rounded object-cover border"
                />
              )}
            </div>

            {/* PDF Upload */}
            <div>
              <label className="text-sm font-medium mb-1 block">
                Upload PDF
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    file: e.target.files?.[0] || null,
                  }))
                }
                className="block border rounded p-2 text-sm"
              />
            </div>

            <Button
              color="primary"
              onPress={handleSubmit}
              disabled={isSubmitting}
              className="mt-2"
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" /> Creating...
                </>
              ) : (
                "Create"
              )}
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
