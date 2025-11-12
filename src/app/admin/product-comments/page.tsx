"use client";
import { useEffect, useState, useCallback } from "react";
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
import { MessageSquare, Eye, Trash2 } from "lucide-react";
import type { Comment, User, Product } from "../../../types";
import api from "../../../lib/api";
import type { InternalAxiosRequestConfig } from "axios";
import { ReplyCommentModal } from "../_components/reply-comment-modal";
import { DeleteProductCommentModal } from "../_components/delete-product-comment-modal";
import toast from "react-hot-toast";

interface CommentWithProduct extends Comment {
  product?: Product;
}

export default function CommentsTable() {
  const [comments, setComments] = useState<CommentWithProduct[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [user, setUser] = useState<User | null>(null);
  const [replyingComment, setReplyingComment] =
    useState<CommentWithProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingComment, setDeletingComment] =
    useState<CommentWithProduct | null>(null);

  const [approvingId, setApprovingId] = useState<number | null>(null);

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me", {
          requiresAuth: true,
        } as InternalAxiosRequestConfig);
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleApprove = async (commentId: number) => {
    setApprovingId(commentId);
    try {
      await api.post(`/comments/${commentId}/approve`, {}, {
        requiresAuth: true,
      } as InternalAxiosRequestConfig);

      toast.success("Comment approved successfully!");
      await fetchComments(page);
    } catch (err: any) {
      if (err.response?.status === 403) {
        toast.error("You are not authorized to approve comments");
      } else {
        toast.error("Failed to approve comment");
      }
    } finally {
      setApprovingId(null);
    }
  };

  // ✅ Fetch all comments (single API call for admin)
  const fetchComments = useCallback(async (pageNumber = 1) => {
    try {
      setLoading(true);
      const res = await api.get(`/comments?page=${pageNumber}`, {
        requiresAuth: true,
      } as InternalAxiosRequestConfig);

      const data = res.data.comments;
      setComments(data.data || []);
      setTotalPages(data.last_page || 1);
      setPage(data.current_page || 1);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchComments(page);
    }
  }, [page, user, fetchComments]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
          You don't have permission to view this page.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Comments Management</h1>
      </div>

      <Table
        aria-label="Comments Table with Pagination"
        className="shadow-md rounded-2xl"
      >
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>USER</TableColumn>
          <TableColumn>PRODUCT</TableColumn>
          <TableColumn>COMMENT</TableColumn>
          <TableColumn>APPROVAL</TableColumn>
          <TableColumn>REPLY STATUS</TableColumn>
          <TableColumn>DATE</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>

        <TableBody emptyContent="No comments found.">
          {comments.map((comment: any) => (
            <TableRow key={comment.id}>
              <TableCell>{comment.id}</TableCell>
              <TableCell>{comment.user?.name || "Unknown"}</TableCell>
              <TableCell className="max-w-[150px] truncate">
                {comment.product?.title || "Unknown"}
              </TableCell>
              <TableCell className="max-w-[200px] truncate">
                {comment.content}
              </TableCell>
              <TableCell>
                {Number(comment.is_approved) === 1 ? (
                  <span className="text-green-600 font-semibold">Approved</span>
                ) : (
                  <span className="text-red-500 font-semibold">Pending</span>
                )}
              </TableCell>
              <TableCell>
                {comment.reply ? (
                  <span className="text-green-600 font-semibold">Replied</span>
                ) : (
                  <span className="text-orange-600 font-semibold">Pending</span>
                )}
              </TableCell>
              <TableCell>{formatDate(comment.created_at)}</TableCell>
              <TableCell>
                <div className="flex gap-3">
                  {/* ✅ دکمه Approve فقط اگر هنوز تایید نشده باشد */}
                  {!Number(comment.is_approved) && (
                    <Button
                      variant="flat"
                      color="success"
                      onPress={() => handleApprove(comment.id)}
                      isDisabled={approvingId === comment.id}
                    >
                      {approvingId === comment.id ? (
                        <Spinner size="sm" color="white" />
                      ) : (
                        "Approve"
                      )}
                    </Button>
                  )}

                  <Button
                    variant="flat"
                    color="primary"
                    onPress={() => setReplyingComment(comment)}
                  >
                    {comment.reply ? (
                      <Eye size={18} />
                    ) : (
                      <MessageSquare size={18} />
                    )}
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
          <Pagination
            total={totalPages}
            page={page}
            onChange={setPage}
            showControls
          />
        </div>
      )}

      {replyingComment && (
        <ReplyCommentModal
          comment={replyingComment}
          isOpen={!!replyingComment}
          onClose={() => setReplyingComment(null)}
          onReplied={() => fetchComments(page)}
        />
      )}

      {deletingComment && (
        <DeleteProductCommentModal
          comment={deletingComment}
          onClose={() => setDeletingComment(null)}
          onDeleted={() => fetchComments(page)}
        />
      )}
    </div>
  );
}
