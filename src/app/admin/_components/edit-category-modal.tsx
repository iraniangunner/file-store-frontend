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
import api from "@/lib/api";

interface Category {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  parent_id: number | null;
}

interface EditCategoryModalProps {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
  onCategoryUpdated?: () => void;
}

export function EditCategoryModal({
  category,
  isOpen,
  onClose,
  onCategoryUpdated,
}: EditCategoryModalProps) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    is_active: true,
    parent_id: null as number | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  // مقداردهی فرم وقتی category تغییر می‌کند
  useEffect(() => {
    if (category) {
      setForm({
        name: category.name || "",
        description: category.description || "",
        is_active: category.is_active ?? true,
        parent_id: category.parent_id ?? null,
      });
    }
  }, [category]);

  // گرفتن دسته‌بندی‌ها برای select parent
  useEffect(() => {
    if (isOpen) {
      api.get("/categories").then((res) => {
        if (res.data.success) {
          setCategories(res.data.data.filter((c: Category) => c.id !== category?.id));
        }
      });
    }
  }, [isOpen, category]);

  const handleSubmit = async () => {
    if (!category) return;

    if (!form.name) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.put(`/categories/${category.id}`, form, {
        requiresAuth: true,
      } as any);
      onCategoryUpdated?.();
      onClose();
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Failed to update category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!category) return null;

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalContent>
        <ModalHeader>Edit Category</ModalHeader>
        <ModalBody className="flex flex-col gap-4">
          <Input
            label="Name"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          />
          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) =>
              setForm((p) => ({ ...p, description: e.target.value }))
            }
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))}
            />
            Active
          </label>

          <label>
            Parent Category
            <select
              value={form.parent_id ?? ""}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  parent_id: e.target.value ? Number(e.target.value) : null,
                }))
              }
              className="w-full border rounded p-2 mt-1"
            >
              <option value="">No Parent</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>

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
              "Update Category"
            )}
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
