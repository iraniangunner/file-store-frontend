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
import api from "@/lib/api"; // axios instance

interface Category {
  id: number;
  name: string;
}

export function CreateProductModal({
  onProductCreated,
}: {
  onProductCreated?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  // const [form, setForm] = useState({
  //   title: "",
  //   description: "",
  //   price: "",
  //   file: null as File | null,
  //   category_ids: [] as string[], // آرایه چندتایی
  // });
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    file: null as File | null,
    image: null as File | null,
    category_ids: [] as string[],
  });

  // Fetch categories
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, file }));
  };

  // const handleSubmit = async () => {
  //   if (
  //     !form.title ||
  //     !form.description ||
  //     !form.price ||
  //     !form.file ||
  //     form.category_ids.length === 0
  //   ) {
  //     alert("Please fill all fields, upload a file, and select at least one category.");
  //     return;
  //   }

  //   setIsSubmitting(true);

  //   try {
  //     const formData = new FormData();
  //     formData.append("title", form.title);
  //     formData.append("description", form.description);
  //     formData.append("price", form.price);
  //     formData.append("file", form.file);

  //     // اضافه کردن همه دسته‌ها به فرم دیتا
  //     form.category_ids.forEach((id) => {
  //       formData.append("category_ids[]", id);
  //     });

  //     await api.post("/products", formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //       requiresAuth: true,
  //     } as any);

  //     setIsOpen(false);
  //     setForm({ title: "", description: "", price: "", file: null, category_ids: [] });
  //     onProductCreated?.(); // Refresh product list
  //   } catch (error) {
  //     console.error("Error creating product:", error);
  //     alert("Failed to create product. Please try again.");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

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

      // ✅ Add image if selected
      if (form.image) {
        formData.append("image", form.image);
      }

      // ✅ Add categories
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
        image: null, // ✅ reset image
        category_ids: [],
      });
      onProductCreated?.();
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

            {/* === Multi-category selection === */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Categories
              </label>
              <div className="flex flex-col gap-1 max-h-40 overflow-y-auto border rounded-lg p-2">
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={cat.id}
                      checked={form.category_ids.includes(String(cat.id))}
                      onChange={(e) => {
                        const value = e.target.value;
                        setForm((p) => {
                          const arr = [...p.category_ids];
                          if (e.target.checked) arr.push(value);
                          else arr.splice(arr.indexOf(value), 1);
                          return { ...p, category_ids: arr };
                        });
                      }}
                    />
                    {cat.name}
                  </label>
                ))}
              </div>
            </div>

            {/* Image upload */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Upload Product Image (PNG, JPG, GIF, etc.)
              </label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const image = e.target.files?.[0] || null;
                  setForm((prev) => ({ ...prev, image }));
                }}
                className="block w-full border rounded-lg p-2 text-sm"
              />
              {form.image && (
                <img
                  src={URL.createObjectURL(form.image)}
                  alt="Preview"
                  className="mt-2 w-32 h-32 object-cover rounded-lg border"
                />
              )}
            </div>
            {/* === File upload === */}
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
