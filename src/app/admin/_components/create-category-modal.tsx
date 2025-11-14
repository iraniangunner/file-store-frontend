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

interface Category {
  id: number;
  name: string;
}

export function CreateCategoryModal({ onCategoryCreated }: { onCategoryCreated?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    is_active: true,
    parent_id: null as number | null,
  });

  // Load existing categories for parent selection
  useEffect(() => {
    if (isOpen) {
      api.get("/categories").then((res) => {
        if (res.data.success) setCategories(res.data.data);
      });
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!form.name) {
      alert("Please fill the name field.");
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post("/categories", form, { requiresAuth: true } as any);

      setIsOpen(false);
      setForm({ name: "", description: "", is_active: true, parent_id: null });
      onCategoryCreated?.();
    } catch (error) {
      console.error("Error creating category:", error);
      alert("Failed to create category. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        color="primary"
        startContent={<Plus size={18} />}
        onPress={() => setIsOpen(true)}
      >
        Create Category
      </Button>

      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
        <ModalContent>
          <ModalHeader>Create New Category</ModalHeader>
          <ModalBody className="flex flex-col gap-4">
            <Input
              label="Name"
              placeholder="Enter category name"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            />

            <Textarea
              label="Description"
              placeholder="Enter category description"
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
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
                  setForm((p) => ({ ...p, parent_id: e.target.value ? Number(e.target.value) : null }))
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

