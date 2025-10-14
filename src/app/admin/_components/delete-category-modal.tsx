"use client";
import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
} from "@heroui/react";
import api from "@/lib/api";

interface Category {
  id: number;
  name: string;
}

interface DeleteCategoryModalProps {
  category: Category;
  onClose: () => void;
  onDeleted: () => void; // callback to refresh table
}

export function DeleteCategoryModal({
  category,
  onClose,
  onDeleted,
}: DeleteCategoryModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/categories/${category.id}`, {
        requiresAuth: true,
      } as any);
      onDeleted(); // refresh table
      onClose(); // close modal
    } catch (err) {
      console.error(err);
      alert("Failed to delete category.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader>Confirm Delete</ModalHeader>
        <ModalBody className="flex flex-col gap-4">
          <p>
            Are you sure you want to delete <strong>{category.name}</strong>?
          </p>
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
