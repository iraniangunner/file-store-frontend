"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Button,
  Textarea,
  Spinner,
  Avatar,
  Divider,
} from "@heroui/react";
import { MessageSquare, Send, Trash2, Reply } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { ProductRating } from "./Productrating";

export interface Comment {
  id: number;
  user_id: number;
  content: string;
  reply: string | null;
  created_at: string;
  user: {
    id: number;
    name: string;
  };
}

interface CommentsSectionProps {
  productSlug: string;
}

export default function CommentsSection({ productSlug }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await api.get("/auth/me");
        setCurrentUserId(res.data.user.id);
      } catch (err) {
        setCurrentUserId(null);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    fetchComments();
  }, [productSlug]);

  async function fetchComments() {
    try {
      setLoading(true);
      const res = await api.get(`/products/${productSlug}/comments`);
      setComments(res.data.comments || []);
    } catch (err) {
      toast.error("Error loading comments");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitComment() {
    if (!newComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    setSubmitting(true);
    try {
      await api.post(`/products/${productSlug}/comments`, {
        content: newComment,
      });

      setNewComment("");

      toast.success(
        "Your comment has been submitted and is awaiting admin approval."
      );

      // ✅ لازم نیست بلافاصله fetchComments() بزنی،
      // چون ادمین هنوز تأیید نکرده، در لیست نخواهد بود.
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error("Please login to comment");
      } else {
        toast.error("Error submitting comment");
      }
    } finally {
      setSubmitting(false);
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare size={24} className="text-primary" />
        <h2 className="text-2xl font-bold">Comments ({comments.length})</h2>
      </div>

      <Card>
        <CardBody>
          <div className="space-y-3">
            <Textarea
              placeholder="Share your thoughts..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              minRows={3}
              maxRows={8}
              disabled={submitting}
            />
            <div className="flex justify-end">
              <Button
                className="bg-gradient-to-r from-[#3B9FE8] to-[#3D3D8F] text-white font-semibold"
                onPress={handleSubmitComment}
                isDisabled={submitting || !newComment.trim()}
                startContent={
                  submitting ? (
                    <Spinner size="sm" color="white" />
                  ) : (
                    <Send size={18} />
                  )
                }
              >
                {submitting ? "Posting..." : "Post Comment"}
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" color="primary" />
        </div>
      ) : comments.length === 0 ? (
        <Card>
          <CardBody>
            <div className="text-center py-12 text-gray-500">
              <MessageSquare size={48} className="mx-auto mb-3 opacity-30" />
              <p>No comments yet. Be the first to comment!</p>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => {
            return (
              <Card key={comment.id}>
                <CardBody>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={comment.user.name}
                          size="sm"
                          className="shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-sm">
                            {comment.user.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(comment.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 whitespace-pre-wrap">
                      {comment.content}
                    </p>

                    {comment.reply && (
                      <>
                        <Divider />
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                          <div className="flex items-start gap-3">
                            <Reply
                              size={18}
                              className="text-primary mt-1 shrink-0"
                            />
                            <div className="flex-1">
                              <p className="font-semibold text-sm text-primary mb-1">
                                Admin Replied
                              </p>
                              <p className="text-gray-700 whitespace-pre-wrap">
                                {comment.reply}
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
