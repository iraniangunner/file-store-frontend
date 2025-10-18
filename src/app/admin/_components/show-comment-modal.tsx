"use client";

import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Spinner,
  Card,
  CardHeader,
  CardBody,
} from "@heroui/react";
import api from "@/lib/api";

interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

interface CommentModalProps {
  comment: Contact;
  isOpen: boolean;
  onClose: () => void;
}

export function CommentModal({ comment, isOpen, onClose }: CommentModalProps) {
  const [data, setData] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!comment || !isOpen) return;

    const fetchComment = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/contacts/${comment.id}`, {
          requiresAuth: true,
        } as any);
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch comment", err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchComment();
  }, [comment, isOpen]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader>Comment Details</ModalHeader>
        <ModalBody className="max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center mt-4">
              <Spinner size="sm" /> Loading...
            </div>
          ) : !data ? (
            <p>Comment not found.</p>
          ) : (
            <Card className="w-full">
              <CardHeader className="flex justify-between items-center">
                <span className="font-semibold text-lg">{data.name}</span>
                <span className="text-xs text-gray-400">
                  {new Date(data.created_at).toLocaleString()}
                </span>
              </CardHeader>
              <CardBody className="flex flex-col gap-2 text-gray-700">
                <div>
                  <strong>Email:</strong> {data.email}
                </div>
                <div>
                  <strong>Message:</strong>
                  <p className="mt-1">{data.message}</p>
                </div>
              </CardBody>
            </Card>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
