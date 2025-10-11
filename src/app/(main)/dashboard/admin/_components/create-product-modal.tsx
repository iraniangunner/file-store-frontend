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
import api from "@/lib/api"; // your axios instance

export function CreateProductModal({ onProductCreated }: { onProductCreated?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    file: null as File | null,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, file }));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.file || !form.price) {
      alert("Please fill all fields and upload a file.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("file", form.file);

      await api.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        requiresAuth: true,
      } as any);

      setIsOpen(false);
      setForm({ title: "", description: "", price: "", file: null });
      onProductCreated?.(); // Refresh product list
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* === Create Product Button === */}
      <Button
        color="primary"
        startContent={<Plus size={18} />}
        onPress={() => setIsOpen(true)}
      >
        Create Product
      </Button>

      {/* === Modal === */}
      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
        <ModalContent>
          <ModalHeader>Create New Product</ModalHeader>
          <ModalBody className="flex flex-col gap-4">
            <Input
              label="Title"
              placeholder="Enter product title"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            />
            <Textarea
              label="Description"
              placeholder="Enter product description"
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            />
            <Input
              label="Price ($)"
              type="number"
              placeholder="Enter price"
              value={form.price}
              onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
            />
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Upload File (PDF)
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="block w-full border rounded-lg p-2 text-sm"
              />
              {form.file && (
                <p className="text-xs text-gray-500 mt-1">
                  {form.file.name} ({(form.file.size / 1024).toFixed(1)} KB)
                </p>
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
