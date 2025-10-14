"use client";

import React, { useState } from "react";
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

export function CreateCategoryModal({ onCategoryCreated }: { onCategoryCreated?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const handleSubmit = async () => {
    if (!form.name) {
      alert("Please fill all fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post("/categories", form, { requiresAuth: true } as any);

      setIsOpen(false);
      setForm({ name: "", description: "" });
      onCategoryCreated?.(); // Refresh category list
    } catch (error) {
      console.error("Error creating category:", error);
      alert("Failed to create category. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* === Create Category Button === */}
      <Button
        color="primary"
        startContent={<Plus size={18} />}
        onPress={() => setIsOpen(true)}
      >
        Create Category
      </Button>

      {/* === Modal === */}
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
