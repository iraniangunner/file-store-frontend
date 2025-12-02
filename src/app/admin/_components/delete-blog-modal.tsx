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

interface BlogPost {
  id: number;
  title: string;
  slug: string;
}

interface DeleteBlogModalProps {
  post: BlogPost;
  onClose: () => void;
  onDeleted: () => void;
}

export function DeleteBlogModal({
  post,
  onClose,
  onDeleted,
}: DeleteBlogModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/blog/posts/${post.slug}`, {
        requiresAuth: true,
      } as any);
      toast.success("Blog post deleted successfully");
      onDeleted();
      onClose();
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 403) {
        toast.error("You are not authorized to delete this post");
      } else {
        toast.error("Failed to delete blog post");
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
            <span className="font-semibold">"{post.title}"</span>?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This action cannot be undone. The blog post and all associated data
            will be permanently removed.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={onClose} isDisabled={isDeleting}>
            Cancel
          </Button>
          <Button color="danger" onPress={handleDelete} isLoading={isDeleting}>
            {isDeleting ? "Deleting..." : "Yes, Delete"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
