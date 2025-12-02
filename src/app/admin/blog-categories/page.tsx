"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Spinner,
  Chip,
} from "@heroui/react";
import { Pencil, Trash2, Plus, Check, X } from "lucide-react";
import type { User } from "@/types";
import api from "@/lib/api";
import type { InternalAxiosRequestConfig } from "axios";
import { EditBlogCategoryModal } from "../_components/edit-blog-category-modal";
import { DeleteBlogCategoryModal } from "../_components/delete-blog-category-modal";
import { CreateBlogCategoryModal } from "../_components/create-blog-category-modal";
import toast from "react-hot-toast";

interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  color: string;
  sort_order: number;
  is_active: boolean;
  posts_count?: number;
  created_at: string;
  updated_at: string;
}

export default function BlogCategoriesTable() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(
    null
  );
  const [deletingCategory, setDeletingCategory] = useState<BlogCategory | null>(
    null
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [togglingActive, setTogglingActive] = useState<number | null>(null);

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me", {
          requiresAuth: true,
        } as InternalAxiosRequestConfig);
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/blog/categories?all=true", {
        requiresAuth: true,
      } as InternalAxiosRequestConfig);

      setCategories(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchCategories();
    }
  }, [user, fetchCategories]);

  // Toggle active status
  const handleToggleActive = async (category: BlogCategory) => {
    setTogglingActive(category.id);
    try {
      await api.put(
        `/blog/categories/${category.slug}`,
        { is_active: !category.is_active },
        { requiresAuth: true } as InternalAxiosRequestConfig
      );
      toast.success(
        category.is_active ? "Category deactivated" : "Category activated"
      );
      fetchCategories();
    } catch (err) {
      toast.error("Failed to update category status");
    } finally {
      setTogglingActive(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getColorClass = (color: string) => {
    const colors: Record<
      string,
      "secondary" | "success" | "primary" | "warning" | "danger" | "default"
    > = {
      violet: "secondary",
      emerald: "success",
      sky: "primary",
      amber: "warning",
      rose: "danger",
    };
    return colors[color] || "default";
  };

  if (loading && !categories.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center text-red-500 text-xl font-semibold">
          You don't have permission to view this page.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Blog Categories</h1>
        <Button
          color="primary"
          startContent={<Plus size={18} />}
          onPress={() => setIsCreateModalOpen(true)}
        >
          New Category
        </Button>
      </div>

      {/* Table */}
      <Table
        aria-label="Blog Categories Table"
        className="shadow-md rounded-2xl"
      >
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>NAME</TableColumn>
          <TableColumn>SLUG</TableColumn>
          <TableColumn>COLOR</TableColumn>
          <TableColumn>POSTS</TableColumn>
          <TableColumn>ORDER</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>CREATED</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>

        <TableBody emptyContent="No categories found." isLoading={loading}>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.id}</TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{category.name}</p>
                  {category.description && (
                    <p className="text-xs text-gray-500 truncate max-w-[200px]">
                      {category.description}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {category.slug}
                </code>
              </TableCell>
              <TableCell>
                <Chip
                  size="sm"
                  variant="flat"
                  color={getColorClass(category.color)}
                >
                  {category.color}
                </Chip>
              </TableCell>
              <TableCell>{category.posts_count ?? 0}</TableCell>
              <TableCell>{category.sort_order}</TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="flat"
                  color={category.is_active ? "success" : "default"}
                  isLoading={togglingActive === category.id}
                  onPress={() => handleToggleActive(category)}
                  startContent={
                    togglingActive !== category.id &&
                    (category.is_active ? <Check size={14} /> : <X size={14} />)
                  }
                >
                  {category.is_active ? "Active" : "Inactive"}
                </Button>
              </TableCell>
              <TableCell>{formatDate(category.created_at)}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="flat"
                    color="primary"
                    isIconOnly
                    onPress={() => setEditingCategory(category)}
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    color="danger"
                    isIconOnly
                    onPress={() => setDeletingCategory(category)}
                    isDisabled={(category.posts_count ?? 0) > 0}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <CreateBlogCategoryModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreated={() => fetchCategories()}
        />
      )}

      {/* Edit Modal */}
      {editingCategory && (
        <EditBlogCategoryModal
          category={editingCategory}
          isOpen={!!editingCategory}
          onClose={() => setEditingCategory(null)}
          onUpdated={() => fetchCategories()}
        />
      )}

      {/* Delete Modal */}
      {deletingCategory && (
        <DeleteBlogCategoryModal
          category={deletingCategory}
          onClose={() => setDeletingCategory(null)}
          onDeleted={() => fetchCategories()}
        />
      )}
    </div>
  );
}
