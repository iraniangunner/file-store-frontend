"use client";
import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
} from "@heroui/react";
import type { Comment } from "../../../types";
import api from "../../../lib/api";

interface DeleteCommentModalProps {
  comment: Comment;
  onClose: () => void;
  onDeleted: () => void; // برای رفرش جدول
}

export function DeleteProductCommentModal({
  comment,
  onClose,
  onDeleted,
}: DeleteCommentModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this comment and its reply (if any)?"
      )
    )
      return;

    setIsDeleting(true);
    try {
      await api.delete(`/comments/${comment.id}`, {
        requiresAuth: true,
      } as any);
      onDeleted(); // رفرش جدول
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete comment.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader>Confirm Delete</ModalHeader>
        <ModalBody className="flex flex-col gap-4">
          <p>Are you sure you want to delete this comment?</p>
          <p className="text-sm text-gray-500">{comment.content}</p>
          {comment.reply && (
            <p className="text-sm text-blue-600">
              Admin Reply: {comment.reply}
            </p>
          )}
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
