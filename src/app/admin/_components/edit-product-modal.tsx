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
  // const [form, setForm] = useState({
  //   title: "",
  //   description: "",
  //   price: "",
  //   file: null as File | null,
  //   category_ids: [] as string[], // تغییر به چند دسته
  // });

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    file: null as File | null,
    image: null as File | null, // ✅ new
    category_ids: [] as string[],
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);


  

  // بارگذاری دسته‌ها
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

  // مقداردهی اولیه فرم با محصول فعلی
  // useEffect(() => {
  //   if (product) {
  //     setForm({
  //       title: product.title || "",
  //       description: product.description || "",
  //       price: product.price?.toString() || "",
  //       file: null,
  //       category_ids: product.categories?.map((c:any) => String(c.id)) || [],
  //     });
  //   }
  // }, [product]);
  useEffect(() => {
    if (product) {
      setForm({
        title: product.title || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        file: null,
        image: null, // ✅ new
        category_ids: product.categories?.map((c: any) => String(c.id)) || [],
      });
    }
  }, [product]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, file }));
  };

  // const handleSubmit = async () => {
  //   if (!product) return;
  //   if (
  //     !form.title ||
  //     !form.description ||
  //     !form.price ||
  //     form.category_ids.length === 0
  //   ) {
  //     alert(
  //       "Please fill in all required fields and select at least one category."
  //     );
  //     return;
  //   }

  //   setIsSubmitting(true);
  //   try {
  //     const formData = new FormData();
  //     formData.append("title", form.title);
  //     formData.append("description", form.description);
  //     formData.append("price", form.price);

  //     // اضافه کردن همه دسته‌ها به فرم دیتا
  //     form.category_ids.forEach((id) => formData.append("category_ids[]", id));

  //     if (form.file) formData.append("file", form.file);

  //     await api.post(`/products/${product.slug}?_method=PUT`, formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //       requiresAuth: true,
  //     } as any);

  //     onProductUpdated?.();
  //     onClose();
  //   } catch (error) {
  //     console.error("Error updating product:", error);
  //     alert("Failed to update product.");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };


  const handleSubmit = async () => {
    if (!product) return;
    if (!form.title || !form.description || !form.price || form.category_ids.length === 0) {
      alert("Please fill in all required fields and select at least one category.");
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
      if (form.image) formData.append("image", form.image); // ✅ new line
  
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
      await api.delete(`/products/${product.slug}/image`, { requiresAuth: true } as any);
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

          {/* چند دسته با checkbox */}
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

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Upload New Product Image (PNG, JPG, etc.)
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

            {/* Show current or new image */}
            {form.image ? (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">
                  Selected: {form.image.name} (
                  {(form.image.size / 1024).toFixed(1)} KB)
                </p>
                <img
                  src={URL.createObjectURL(form.image)}
                  alt="Preview"
                  className="w-24 h-24 rounded-lg object-cover border"
                />
              </div>
            ) : product.image_url && !form.image ? (
              <div className="mt-2">
                <p className="text-xs text-gray-400 mb-1">Current Image:</p>
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
              <p className="text-xs text-gray-400 mt-1">No image uploaded yet.</p>
            )}
          </div>

          {/* فایل */}
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
