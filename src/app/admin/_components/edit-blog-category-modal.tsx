"use client";

import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  Button,
  Switch,
} from "@heroui/react";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  color: string;
  sort_order: number;
  is_active: boolean;
}

interface EditBlogCategoryModalProps {
  category: BlogCategory;
  isOpen: boolean;
  onClose: () => void;
  onUpdated?: () => void;
}

const colorOptions = [
  { value: "violet", label: "Violet", bg: "bg-violet-500" },
  { value: "emerald", label: "Emerald", bg: "bg-emerald-500" },
  { value: "sky", label: "Sky", bg: "bg-sky-500" },
  { value: "amber", label: "Amber", bg: "bg-amber-500" },
  { value: "rose", label: "Rose", bg: "bg-rose-500" },
  { value: "indigo", label: "Indigo", bg: "bg-indigo-500" },
  { value: "teal", label: "Teal", bg: "bg-teal-500" },
  { value: "orange", label: "Orange", bg: "bg-orange-500" },
];

export function EditBlogCategoryModal({
  category,
  isOpen,
  onClose,
  onUpdated,
}: EditBlogCategoryModalProps) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    color: "violet",
    sort_order: 0,
    is_active: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with category data
  useEffect(() => {
    if (category) {
      setForm({
        name: category.name || "",
        description: category.description || "",
        color: category.color || "violet",
        sort_order: category.sort_order || 0,
        is_active: category.is_active ?? true,
      });
    }
  }, [category]);

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.put(`/blog/categories/${category.slug}`, form, {
        requiresAuth: true,
      } as any);

      toast.success("Category updated successfully");
      onUpdated?.();
      onClose();
    } catch (error: any) {
      console.error("Error updating category:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to update category");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalContent>
        <ModalHeader>Edit Category</ModalHeader>
        <ModalBody className="flex flex-col gap-4">
          {/* Name */}
          <Input
            label="Name"
            placeholder="Enter category name"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            isRequired
          />

          {/* Description */}
          <Textarea
            label="Description"
            placeholder="Brief description of the category"
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            maxRows={3}
          />

          {/* Color */}
          <div>
            <label className="text-sm font-medium mb-2 block">Color</label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, color: color.value }))}
                  className={`w-8 h-8 rounded-full ${color.bg} transition-all ${
                    form.color === color.value
                      ? "ring-2 ring-offset-2 ring-gray-400 scale-110"
                      : "hover:scale-105"
                  }`}
                  title={color.label}
                />
              ))}
            </div>
          </div>

          {/* Sort Order */}
          <Input
            type="number"
            label="Sort Order"
            placeholder="0"
            value={form.sort_order.toString()}
            onChange={(e) =>
              setForm((p) => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))
            }
          />

          {/* Active Switch */}
          <Switch
            isSelected={form.is_active}
            onValueChange={(checked) => setForm((p) => ({ ...p, is_active: checked }))}
          >
            Active
          </Switch>
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={onClose} isDisabled={isSubmitting}>
            Cancel
          </Button>
          <Button color="primary" onPress={handleSubmit} isLoading={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Category"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
