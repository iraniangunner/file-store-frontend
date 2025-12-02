"use client";

import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
} from "@heroui/react";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface BlogTag {
  id: number;
  name: string;
  slug: string;
}

interface EditBlogTagModalProps {
  tag: BlogTag;
  isOpen: boolean;
  onClose: () => void;
  onUpdated?: () => void;
}

export function EditBlogTagModal({
  tag,
  isOpen,
  onClose,
  onUpdated,
}: EditBlogTagModalProps) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with tag data
  useEffect(() => {
    if (tag) {
      setName(tag.name || "");
    }
  }, [tag]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Please enter a tag name");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.put(
        `/blog/tags/${tag.slug}`,
        { name: name.trim() },
        { requiresAuth: true } as any
      );

      toast.success("Tag updated successfully");
      onUpdated?.();
      onClose();
    } catch (error: any) {
      console.error("Error updating tag:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to update tag");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalContent>
        <ModalHeader>Edit Tag</ModalHeader>
        <ModalBody>
          <Input
            label="Tag Name"
            placeholder="Enter tag name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            isRequired
            autoFocus
          />
          <p className="text-xs text-gray-500 mt-1">
            Current slug: <code className="bg-gray-100 px-1 rounded">{tag.slug}</code>
          </p>
          <p className="text-xs text-gray-500">
            The slug will be updated automatically when you change the name.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={onClose} isDisabled={isSubmitting}>
            Cancel
          </Button>
          <Button color="primary" onPress={handleSubmit} isLoading={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Tag"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
