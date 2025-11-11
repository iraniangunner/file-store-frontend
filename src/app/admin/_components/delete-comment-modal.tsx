"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
} from "@heroui/react";
import { Contact } from "@/types"; 
import api from "@/lib/api";

interface DeleteCommentModalProps {
  comment: Contact;
  onClose: () => void;
  onDeleted: () => void;
}

export function DeleteCommentModal({ comment, onClose, onDeleted }: DeleteCommentModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/contacts/${comment.id}`, { requiresAuth: true } as any);
      onDeleted();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to delete comment.");
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
            Are you sure you want to delete <strong>{comment.name}</strong>’s comment?
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
