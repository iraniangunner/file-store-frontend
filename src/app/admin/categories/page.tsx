"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "@heroui/react";
import { Pagination } from "@heroui/pagination";
import { Pencil, Trash2 } from "lucide-react";
import api from "@/lib/api";
import { InternalAxiosRequestConfig } from "axios";
import { CreateCategoryModal } from "../_components/create-category-modal";
import { EditCategoryModal } from "../_components/edit-category-modal";
import { DeleteCategoryModal } from "../_components/delete-category-modal";

interface Category {
  id: number;
  name: string;
  description: string;
}

interface User {
  id: number;
  name: string;
  role: string;
}

export default function CategoryTable() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [user, setUser] = useState<User | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const rowsPerPage = 10;

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
  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories", {
        requiresAuth: true,
      } as InternalAxiosRequestConfig);
      setCategories(res.data.data || res.data); // adjust depending on API response
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const totalPages = Math.ceil(categories.length / rowsPerPage);
  const paginatedData = categories.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading...
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center text-red-500 text-xl font-semibold">
          🚫 You don’t have permission to view this page.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-6">
      <CreateCategoryModal onCategoryCreated={fetchCategories} />

      <Table
        aria-label="Categories Table with Pagination"
        className="shadow-md rounded-2xl"
      >
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>Name</TableColumn>
          <TableColumn>Description</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>

        <TableBody emptyContent={"No categories found."}>
          {paginatedData.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.id}</TableCell>
              <TableCell>{category.name}</TableCell>
              <TableCell className="max-w-[250px] truncate">
                {category.description}
              </TableCell>
              <TableCell>
                <div className="flex gap-3">
                  <Button
                    variant="flat"
                    color="primary"
                    onPress={() => setEditingCategory(category)}
                  >
                    <Pencil size={18} />
                  </Button>
                  <Button
                    variant="flat"
                    color="danger"
                    onPress={() => setDeletingCategory(category)}
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination
            total={totalPages}
            page={page}
            onChange={setPage}
            showControls
          />
        </div>
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <EditCategoryModal
          category={editingCategory}
          isOpen={!!editingCategory}
          onClose={() => setEditingCategory(null)}
          onCategoryUpdated={fetchCategories}
        />
      )}

      {/* Delete Category Modal */}
      {deletingCategory && (
        <DeleteCategoryModal
          category={deletingCategory}
          onClose={() => setDeletingCategory(null)}
          onDeleted={fetchCategories}
        />
      )}
    </div>
  );
}
