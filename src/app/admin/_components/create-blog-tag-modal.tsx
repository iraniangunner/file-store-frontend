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

interface CreateBlogTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export function CreateBlogTagModal({
  isOpen,
  onClose,
  onCreated,
}: CreateBlogTagModalProps) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setName("");
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Please enter a tag name");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post(
        "/blog/tags",
        { name: name.trim() },
        { requiresAuth: true } as any
      );

      toast.success("Tag created successfully");
      onCreated?.();
      onClose();
    } catch (error: any) {
      console.error("Error creating tag:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to create tag");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalContent>
        <ModalHeader>Create New Tag</ModalHeader>
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
            The slug will be automatically generated from the name.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={onClose} isDisabled={isSubmitting}>
            Cancel
          </Button>
          <Button color="primary" onPress={handleSubmit} isLoading={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Tag"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
