"use client";

import { useState, useEffect } from "react";
import { Spinner } from "@heroui/react";
import { MessageSquare, Send, Reply, User, Clock } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import api from "@/lib/api";

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

  function getUserInitials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  return (
    <div className="space-y-8">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl shadow-lg shadow-violet-500/25">
          <MessageSquare className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Comments</h2>
          <p className="text-sm text-slate-500">
            {comments.length} {comments.length === 1 ? "comment" : "comments"}
          </p>
        </div>
      </div>

      {/* Comment Form */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Leave a comment
          </label>
          <textarea
            placeholder="Share your thoughts about this product..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={submitting}
            rows={4}
            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400
                     focus:outline-none focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10
                     transition-all duration-200 resize-none disabled:opacity-50"
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Comments are moderated before appearing
            </p>
            <button
              onClick={handleSubmitComment}
              disabled={submitting || !newComment.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-500 to-violet-600 
                       hover:from-violet-600 hover:to-violet-700 disabled:from-slate-300 disabled:to-slate-400
                       text-white font-semibold rounded-xl shadow-lg shadow-violet-500/25 
                       hover:shadow-xl hover:shadow-violet-500/30 disabled:shadow-none
                       transition-all duration-200 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Spinner size="sm" color="white" />
                  <span>Posting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Post Comment</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 animate-pulse"
            >
              {/* Header Skeleton */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-200"></div>
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="w-32 h-4 bg-slate-200 rounded"></div>
                  <div className="w-24 h-3 bg-slate-200 rounded"></div>
                </div>
              </div>

              {/* Content Skeleton */}
              <div className="space-y-2 pl-14">
                <div className="w-full h-3 bg-slate-200 rounded"></div>
                <div className="w-3/4 h-3 bg-slate-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            No comments yet
          </h3>
          <p className="text-slate-500">
            Be the first to share your thoughts about this product!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment, index) => (
            <div
              key={comment.id}
              className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="p-6">
                {/* Comment Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-violet-500/25 flex-shrink-0">
                    {getUserInitials(comment.user.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-slate-900">
                        {comment.user.name}
                      </h4>
                      <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="w-3 h-3" />
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Comment Content */}
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap pl-14">
                  {comment.content}
                </p>

                {/* Admin Reply */}
                {comment.reply && (
                  <div className="mt-4 ml-14 p-4 bg-gradient-to-r from-violet-50 to-sky-50 rounded-xl border border-violet-100">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                        <Reply className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-semibold text-violet-700">
                            Admin Reply
                          </span>
                          <span className="px-2 py-0.5 bg-violet-100 text-violet-600 text-[10px] font-bold rounded-full uppercase">
                            Official
                          </span>
                        </div>
                        <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                          {comment.reply}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
