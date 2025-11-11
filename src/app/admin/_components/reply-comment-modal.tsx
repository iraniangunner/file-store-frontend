"use client";
import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
} from "@heroui/react";
import type { Comment, Product } from "../../../types";
import api from "../../../lib/api";

interface CommentWithProduct extends Comment {
  product?: Product;
}

interface ReplyCommentModalProps {
  comment: CommentWithProduct;
  isOpen: boolean;
  onClose: () => void;
  onReplied: () => void;
}

export function ReplyCommentModal({
  comment,
  isOpen,
  onClose,
  onReplied,
}: ReplyCommentModalProps) {
  const [reply, setReply] = useState(comment.reply || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!reply.trim()) {
      setError("Reply cannot be empty");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.post(`/comments/${comment.id}/reply`, {
        reply: reply.trim(),
      });

      onReplied();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to reply to comment");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReply = async () => {
    if (!confirm("Are you sure you want to delete this reply?")) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.delete(`/comments/${comment.id}/reply`);
      onReplied();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete reply");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Reply to Comment
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-4">
            {/* Comment Details */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-sm">{comment.user.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatDate(comment.created_at)}
                  </p>
                </div>
                {comment.product && (
                  <p className="text-xs text-blue-600 font-medium">
                    {comment.product.title}
                  </p>
                )}
              </div>
              <p className="text-sm mt-2">{comment.content}</p>
            </div>

            {/* Existing Reply (if any)
            {comment.reply && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="font-semibold text-sm text-blue-700 dark:text-blue-400 mb-2">
                  Current Admin Reply:
                </p>
                <p className="text-sm">{comment.reply}</p>
              </div>
            )} */}

            {/* Existing Reply (if any) */}
            {comment.reply && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-semibold text-sm text-blue-700 dark:text-blue-400">
                    Current Admin Reply:
                  </p>
                  <Button
                    color="danger"
                    variant="flat"
                    size="sm"
                    onPress={handleDeleteReply}
                    isLoading={loading}
                  >
                    Delete Reply
                  </Button>
                </div>
                <p className="text-sm">{comment.reply}</p>
              </div>
            )}

            {/* Reply Input */}
            <Textarea
              label={comment.reply ? "Edit Reply" : "Your Reply"}
              placeholder="Write your reply here..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              minRows={4}
              maxRows={8}
              variant="bordered"
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            variant="flat"
            onPress={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button color="primary" onPress={handleSubmit} isLoading={loading}>
            {comment.reply ? "Update Reply" : "Send Reply"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
