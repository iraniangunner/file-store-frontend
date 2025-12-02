"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { AlertTriangle } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  posts_count?: number;
}

interface DeleteBlogCategoryModalProps {
  category: BlogCategory;
  onClose: () => void;
  onDeleted: () => void;
}

export function DeleteBlogCategoryModal({
  category,
  onClose,
  onDeleted,
}: DeleteBlogCategoryModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if ((category.posts_count ?? 0) > 0) {
      toast.error("Cannot delete category with existing posts");
      return;
    }

    setIsDeleting(true);
    try {
      await api.delete(`/blog/categories/${category.slug}`, {
        requiresAuth: true,
      } as any);
      toast.success("Category deleted successfully");
      onDeleted();
      onClose();
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 422) {
        toast.error("Cannot delete category with existing posts");
      } else if (err.response?.status === 403) {
        toast.error("You are not authorized to delete this category");
      } else {
        toast.error("Failed to delete category");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={true} onOpenChange={(open) => !open && onClose()}>
      <ModalContent>
        <ModalHeader className="flex items-center gap-2 text-danger">
          <AlertTriangle size={20} />
          Confirm Delete
        </ModalHeader>
        <ModalBody>
          <p>
            Are you sure you want to delete{" "}
            <span className="font-semibold">"{category.name}"</span>?
          </p>
          {(category.posts_count ?? 0) > 0 ? (
            <p className="text-sm text-red-500 mt-2">
              This category has {category.posts_count} post(s). You must remove
              or reassign all posts before deleting this category.
            </p>
          ) : (
            <p className="text-sm text-gray-500 mt-2">
              This action cannot be undone.
            </p>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={onClose} isDisabled={isDeleting}>
            Cancel
          </Button>
          <Button
            color="danger"
            onPress={handleDelete}
            isLoading={isDeleting}
            isDisabled={(category.posts_count ?? 0) > 0}
          >
            {isDeleting ? "Deleting..." : "Yes, Delete"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
