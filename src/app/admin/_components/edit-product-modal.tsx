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

interface Category {
  id: number;
  name: string;
}

interface EditProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onProductUpdated?: () => void;
}

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
    categoryId: "",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Load categories
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

  // Initialize form when product changes
  useEffect(() => {
    if (product) {
      setForm({
        title: product.title || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        file: null,
        categoryId: product.category_id?.toString() || "",
      });
    }
  }, [product]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, file }));
  };

  const handleSubmit = async () => {
    if (!product) return;

    if (!form.title || !form.description || !form.price) {
      alert("Please fill in all required fields and select a category.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("category_id", form.categoryId);

      if (form.file) formData.append("file", form.file);

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

  const handleDownload = async () => {
    if (!product) return;
    setIsDownloading(true);
    try {
      const res = await api.get(`/products/${product.id}/download`, {
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
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          />
          <Input
            label="Price ($)"
            type="number"
            value={form.price}
            onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
          />

          {/* Category Dropdown */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Category
            </label>
            <select
              value={form.categoryId}
              onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))}
              className="block w-full border rounded-lg p-2 text-sm"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

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
            ) : (
              product.file_path && (
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
              )
            )}
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
