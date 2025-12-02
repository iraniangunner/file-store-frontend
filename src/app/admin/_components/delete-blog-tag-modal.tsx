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

interface BlogTag {
  id: number;
  name: string;
  slug: string;
  posts_count?: number;
}

interface DeleteBlogTagModalProps {
  tag: BlogTag;
  onClose: () => void;
  onDeleted: () => void;
}

export function DeleteBlogTagModal({
  tag,
  onClose,
  onDeleted,
}: DeleteBlogTagModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/blog/tags/${tag.slug}`, {
        requiresAuth: true,
      } as any);
      toast.success("Tag deleted successfully");
      onDeleted();
      onClose();
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 403) {
        toast.error("You are not authorized to delete this tag");
      } else {
        toast.error("Failed to delete tag");
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
            Are you sure you want to delete the tag{" "}
            <span className="font-semibold">"{tag.name}"</span>?
          </p>
          {(tag.posts_count ?? 0) > 0 && (
            <p className="text-sm text-amber-600 mt-2">
              This tag is used in {tag.posts_count} post(s). The tag will be
              removed from all posts.
            </p>
          )}
          <p className="text-sm text-gray-500 mt-2">
            This action cannot be undone.
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
