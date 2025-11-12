"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Spinner,
} from "@heroui/react";
import { Pagination } from "@heroui/pagination";
import { Trash2, Eye } from "lucide-react";
import api from "@/lib/api";
import { InternalAxiosRequestConfig } from "axios";
import { DeleteCommentModal } from "../_components/delete-comment-modal";
import { CommentModal } from "../_components/show-comment-modal";

interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

interface User {
  id: number;
  name: string;
  role: string;
}

export default function CommentsPage() {
  const [comments, setComments] = useState<Contact[]>([]);
  const [page, setPage] = useState(1);
  const [user, setUser] = useState<User | null>(null);
  const [selectedComment, setSelectedComment] = useState<Contact | null>(null);
  const [deletingComment, setDeletingComment] = useState<Contact | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const rowsPerPage = 10;

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me", { requiresAuth: true } as InternalAxiosRequestConfig);
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Fetch comments
  const fetchComments = async () => {
    try {
      const res = await api.get("/contacts", { requiresAuth: true } as InternalAxiosRequestConfig);
      setComments(res.data.data || res.data);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const totalPages = Math.ceil(comments.length / rowsPerPage);
  const paginatedData = comments.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
       <Spinner/>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center text-red-500 text-xl font-semibold">
          🚫 You don’t have permission to view this page.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-6">
      <Table
        aria-label="Comments Table with Pagination"
        className="shadow-md rounded-2xl"
      >
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>Name</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Message</TableColumn>
          <TableColumn>Date</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>

        <TableBody emptyContent="No comments found.">
          {paginatedData.map((comment) => (
            <TableRow key={comment.id}>
              <TableCell>{comment.id}</TableCell>
              <TableCell>{comment.name}</TableCell>
              <TableCell>{comment.email}</TableCell>
              <TableCell className="max-w-[250px] truncate">{comment.message}</TableCell>
              <TableCell>{new Date(comment.created_at).toLocaleString()}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="flat"
                    color="primary"
                    onPress={() => {
                      setSelectedComment(comment);
                      setShowModal(true);
                    }}
                  >
                    <Eye size={18} />
                  </Button>
                  <Button
                    variant="flat"
                    color="danger"
                    onPress={() => setDeletingComment(comment)}
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination total={totalPages} page={page} onChange={setPage} showControls />
        </div>
      )}

      {/* Show Comment Modal */}
      {selectedComment && (
        <CommentModal
          comment={selectedComment}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Delete Comment Modal */}
      {deletingComment && (
        <DeleteCommentModal
          comment={deletingComment}
          onClose={() => setDeletingComment(null)}
          onDeleted={fetchComments}
        />
      )}
    </div>
  );
}
