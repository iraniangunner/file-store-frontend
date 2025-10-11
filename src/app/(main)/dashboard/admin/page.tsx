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
import { Pencil, Trash2 } from "lucide-react"; // 👈 Import icons
import { Product, User } from "@/types";
import api from "@/lib/api";
import { InternalAxiosRequestConfig } from "axios";
import { CreateProductModal } from "./_components/create-product-modal";
import { EditProductModal } from "./_components/edit-product-modal";
import { DeleteProductModal } from "./_components/delete-product-modal";

export default function ProductTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [user, setUser] = useState<User | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const rowsPerPage = 5;

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

  const fetchProducts = async () => {
    try {
      const response = await fetch("https://filerget.com/api/products");
      const result = await response.json();
      setProducts(result);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, []);

  const totalPages = Math.ceil(products.length / rowsPerPage);
  const paginatedData = products.slice(
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
      <CreateProductModal onProductCreated={fetchProducts} />
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

        <TableBody emptyContent={"No products found."}>
          {paginatedData.map((product) => (
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
                  {/* ✅ Open Edit Modal on click */}
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

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            total={totalPages}
            page={page}
            onChange={setPage}
            showControls
            className="mt-4"
          />
        </div>
      )}

      {/* ✅ Edit Product Modal */}
      {editingProduct && (
       <EditProductModal
       product={editingProduct}
       isOpen={!!editingProduct}
       onClose={() => setEditingProduct(null)}
       onProductUpdated={fetchProducts}
     />
      )}

      {deletingProduct && (
        <DeleteProductModal
          product={deletingProduct}
          onClose={() => setDeletingProduct(null)}
          onDeleted={fetchProducts} // refresh table
        />
      )}
    </div>
  );
}
