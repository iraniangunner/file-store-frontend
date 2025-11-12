"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Spinner,
  Input,
} from "@heroui/react";
import { Pagination } from "@heroui/pagination";
import { Pencil, Trash2 } from "lucide-react";
import { Product, User } from "../../../types";
import api from "../../../lib/api";
import { InternalAxiosRequestConfig } from "axios";
import { CreateProductModal } from "../_components/create-product-modal";
import { EditProductModal } from "../_components/edit-product-modal";
import { DeleteProductModal } from "../_components/delete-product-modal";

export default function ProductTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [user, setUser] = useState<User | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const rowsPerPage = 6;

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // وقتی search تغییر می‌کنه، به صفحه 1 برگرد
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

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

  // Fetch products with server-side pagination & search
  const fetchProducts = useCallback(
    async (pageNumber: number = 1, searchTerm: string = "") => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://filerget.com/api/products?page=${pageNumber}&per_page=${rowsPerPage}&search=${encodeURIComponent(
            searchTerm
          )}`
        );
        const data = await response.json();
        setProducts(data.data);
        setTotalPages(data.last_page || 1);
        setPage(data.current_page || 1);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Fetch products on page change or debounced search
  useEffect(() => {
    if (user && user.role === "admin") {
      fetchProducts(page, debouncedSearch);
    }
  }, [page, debouncedSearch, user, fetchProducts]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        <Spinner />
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
      {/* Search Bar */}
      <div className="flex justify-between items-center gap-4 mb-4">
        <CreateProductModal
          onProductCreated={() => fetchProducts(page, debouncedSearch)}
        />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          className="max-w-sm"
        />
      </div>

      <Table
        aria-label="Products Table with Pagination"
        className="shadow-md rounded-2xl"
      >
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>TITLE</TableColumn>
          <TableColumn>DESCRIPTION</TableColumn>
          <TableColumn>PRICE ($)</TableColumn>
          <TableColumn>TOTAL SALES</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>

        <TableBody emptyContent="No products found.">
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.id}</TableCell>
              <TableCell>{product.title}</TableCell>
              <TableCell className="max-w-[250px] truncate">
                {product.description}
              </TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>{product.total_sales}</TableCell>
              <TableCell>
                <div className="flex gap-3">
                  <Button
                    variant="flat"
                    color="primary"
                    onPress={() => setEditingProduct(product)}
                  >
                    <Pencil size={18} />
                  </Button>
                  <Button
                    variant="flat"
                    color="danger"
                    onPress={() => setDeletingProduct(product)}
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          isOpen={!!editingProduct}
          onClose={() => setEditingProduct(null)}
          onProductUpdated={() => fetchProducts(page, debouncedSearch)}
        />
      )}

      {deletingProduct && (
        <DeleteProductModal
          product={deletingProduct}
          onClose={() => setDeletingProduct(null)}
          onDeleted={() => fetchProducts(page, debouncedSearch)}
        />
      )}
    </div>
  );
}
