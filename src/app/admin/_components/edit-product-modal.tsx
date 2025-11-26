"use client";

import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Input,
  Textarea,
  Button,
  Spinner,
} from "@heroui/react";
import { Product } from "@/types";
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

interface EditProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onProductUpdated?: () => void;
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
        {hasChildren && (
          <button
            className="w-5 text-gray-600"
            onClick={() =>
              setExpanded((prev) => ({ ...prev, [node.id]: !isExpanded }))
            }
          >
            {isExpanded ? "▾" : "▸"}
          </button>
        )}

        {node.parent_id === null || node.children.length > 0 ? (
          <span className={node.parent_id === null ? "font-semibold" : "ml-1"}>
            {node.name}
          </span>
        ) : (
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
        )}

        {/* <label className="flex items-center gap-2">
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
        </label> */}
      </div>

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
export function EditProductModal({
  product,
  isOpen,
  onClose,
  onProductUpdated,
}: EditProductModalProps) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    file: null as File | null,
    image: null as File | null,
    category_ids: [] as string[],
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

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

  useEffect(() => {
    if (!product) return;
    setForm({
      title: product.title || "",
      description: product.description || "",
      price: product.price?.toString() || "",
      file: null,
      image: null,
      category_ids: product.categories?.map((c: any) => String(c.id)) || [],
    });
  }, [product]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, file: e.target.files?.[0] || null }));
  };

  const handleSubmit = async () => {
    if (!product) return;
    if (
      !form.title ||
      !form.description ||
      !form.price ||
      form.category_ids.length === 0
    ) {
      alert(
        "Please fill in all required fields and select at least one category."
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("price", form.price);

      form.category_ids.forEach((id) => formData.append("category_ids[]", id));

      if (form.file) formData.append("file", form.file);
      if (form.image) formData.append("image", form.image);

      await api.post(`/products/${product.slug}?_method=PUT`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        requiresAuth: true,
      } as any);

      onProductUpdated?.();
      onClose();
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!product) return;
    if (!confirm("Are you sure you want to delete this image?")) return;

    setIsSubmitting(true);
    try {
      await api.delete(`/products/${product.slug}/image`, {
        requiresAuth: true,
      } as any);
      alert("Image deleted successfully.");
      onProductUpdated?.();
      onClose();
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = async () => {
    if (!product || !product.file_path) return;
    setIsDownloading(true);
    try {
      const res = await api.get(`/products/${product.slug}/download`, {
        responseType: "blob",
        requiresAuth: true,
      } as any);

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = product.file_path.split("/").pop() || "file.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download file.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (!product) return null;

  const tree = buildTree(categories);

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalContent>
        <ModalHeader>Edit Product</ModalHeader>
        <ModalBody className="flex flex-col gap-4">
          <Input
            label="Title"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          />
          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) =>
              setForm((p) => ({ ...p, description: e.target.value }))
            }
          />
          <Input
            label="Price ($)"
            type="number"
            value={form.price}
            onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
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
              Upload New Product Image
            </label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setForm((p) => ({ ...p, image: e.target.files?.[0] || null }))
              }
            />
            {form.image ? (
              <img
                src={URL.createObjectURL(form.image)}
                alt="Preview"
                className="w-24 h-24 rounded-lg object-cover border mt-2"
              />
            ) : product.image_url ? (
              <div className="mt-2">
                <img
                  src={`https://filerget.com${product.image_url}`}
                  alt={product.title}
                  className="w-24 h-24 rounded-lg object-cover border"
                />
                <Button
                  color="danger"
                  size="sm"
                  variant="flat"
                  className="mt-2"
                  onPress={handleDeleteImage}
                  disabled={isSubmitting}
                >
                  Delete Image
                </Button>
              </div>
            ) : (
              <p className="text-xs text-gray-400 mt-1">
                No image uploaded yet.
              </p>
            )}
          </div>

          {/* PDF File */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Upload New File (PDF)
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="block w-full border rounded-lg p-2 text-sm"
            />
            {form.file ? (
              <p className="text-xs text-gray-500 mt-1">
                {form.file.name} ({(form.file.size / 1024).toFixed(1)} KB)
              </p>
            ) : product.file_path ? (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-400">
                  Current file: {product.file_path.split("/").pop()}
                </span>
                <Button
                  size="sm"
                  variant="flat"
                  onPress={handleDownload}
                  disabled={isDownloading}
                >
                  {isDownloading ? <Spinner size="sm" /> : "Download"}
                </Button>
              </div>
            ) : null}
          </div>

          <Button
            color="primary"
            onPress={handleSubmit}
            disabled={isSubmitting}
            className="mt-2"
          >
            {isSubmitting ? (
              <>
                <Spinner size="sm" /> Updating...
              </>
            ) : (
              "Update Product"
            )}
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
