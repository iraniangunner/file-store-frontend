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
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // مقداردهی فرم وقتی category تغییر می‌کند
  useEffect(() => {
    if (category) {
      setForm({
        name: category.name || "",
        description: category.description || "",
      });
    }
  }, [category]);

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
