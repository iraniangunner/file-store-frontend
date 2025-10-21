"use client";
import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@heroui/react";
import api from "@/lib/api";
import { Order } from "@/types";
import toast from "react-hot-toast";

interface DeleteOrderModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onDeleted: () => void; // callback after successful deletion
}

export function DeleteOrderModal({ order, isOpen, onClose, onDeleted }: DeleteOrderModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/orders/${order.id}`, { requiresAuth: true } as any);
      toast.success("Order deleted successfully!");
      onDeleted();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete order.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader>Confirm Delete</ModalHeader>
        <ModalBody className="flex flex-col gap-4">
          <p>
            Are you sure you want to delete the order for <strong>{order.product?.title}</strong>?
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
