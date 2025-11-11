"use client";
import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@heroui/react";
import { Product } from "@/types";
import api from "@/lib/api";

interface DeleteProductModalProps {
  product: Product;
  onClose: () => void;
  onDeleted: () => void; 
}

export function DeleteProductModal({ product, onClose, onDeleted }: DeleteProductModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/products/${product.slug}`, { requiresAuth: true } as any);
      onDeleted(); 
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to delete product.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader>Confirm Delete</ModalHeader>
        <ModalBody className="flex flex-col gap-4">
          <p>Are you sure you want to delete <strong>{product.title}</strong>?</p>
          <div className="flex justify-end gap-2 mt-2">
            <Button variant="flat" onPress={onClose} color="secondary">
              Cancel
            </Button>
            <Button color="danger" onPress={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Yes, Delete"}
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
