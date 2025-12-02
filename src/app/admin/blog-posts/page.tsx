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
  Input,
  Chip,
} from "@heroui/react";
import { Pagination } from "@heroui/pagination";
import { Pencil, Trash2, Eye, Plus, Search, Star, StarOff } from "lucide-react";
import type { User } from "@/types";
import api from "@/lib/api";
import type { InternalAxiosRequestConfig } from "axios";
import { EditBlogModal } from "../_components/edit-blog-modal";
import { DeleteBlogModal } from "../_components/delete-blog-modal";
import { CreateBlogModal } from "../_components/create-blog-modal";
import toast from "react-hot-toast";
import Link from "next/link";

interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  color: string;
}

interface BlogAuthor {
  id: number;
  name: string;
}

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  cover_image_url: string | null;
  category_id: number;
  author_id: number;
  is_featured: boolean;
  is_published: boolean;
  published_at: string | null;
  formatted_date: string | null;
  read_time: string;
  views_count: number;
  created_at: string;
  updated_at: string;
  category?: BlogCategory;
  author?: BlogAuthor;
  tags?: { id: number; name: string; slug: string }[];
}

export default function BlogsTable() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deletingPost, setDeletingPost] = useState<BlogPost | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [togglingFeatured, setTogglingFeatured] = useState<number | null>(null);
  const [togglingPublished, setTogglingPublished] = useState<number | null>(
    null
  );

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

  // Fetch blog posts
  const fetchPosts = useCallback(
    async (pageNumber = 1) => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: pageNumber.toString(),
          all: "true", // Get all posts including unpublished
        });

        if (searchQuery) {
          params.append("search", searchQuery);
        }

        const res = await api.get(`/blog/posts?${params.toString()}`, {
          requiresAuth: true,
        } as InternalAxiosRequestConfig);

        setPosts(res.data.data || []);
        setTotalPages(res.data.meta?.last_page || 1);
        setPage(res.data.meta?.current_page || 1);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        toast.error("Failed to fetch blog posts");
      } finally {
        setLoading(false);
      }
    },
    [searchQuery]
  );

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchPosts(page);
    }
  }, [page, user, fetchPosts]);

  // Handle search
  const handleSearch = () => {
    setPage(1);
    fetchPosts(1);
  };

  // Toggle featured status
  const handleToggleFeatured = async (post: BlogPost) => {
    setTogglingFeatured(post.id);
    try {
      await api.put(
        `/blog/posts/${post.slug}`,
        { is_featured: !post.is_featured },
        { requiresAuth: true } as InternalAxiosRequestConfig
      );
      toast.success(
        post.is_featured
          ? "Post removed from featured"
          : "Post marked as featured"
      );
      fetchPosts(page);
    } catch (err) {
      toast.error("Failed to update featured status");
    } finally {
      setTogglingFeatured(null);
    }
  };

  // Toggle published status
  const handleTogglePublished = async (post: BlogPost) => {
    setTogglingPublished(post.id);
    try {
      await api.put(
        `/blog/posts/${post.slug}`,
        {
          is_published: !post.is_published,
          published_at: !post.is_published ? new Date().toISOString() : null,
        },
        { requiresAuth: true } as InternalAxiosRequestConfig
      );
      toast.success(
        post.is_published ? "Post unpublished" : "Post published successfully"
      );
      fetchPosts(page);
    } catch (err) {
      toast.error("Failed to update publish status");
    } finally {
      setTogglingPublished(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading && !posts.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Blog Management</h1>
        <Button
          color="primary"
          startContent={<Plus size={18} />}
          onPress={() => setIsCreateModalOpen(true)}
        >
          New Post
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <Input
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          startContent={<Search size={18} className="text-gray-400" />}
          className="max-w-md"
        />
        <Button color="primary" variant="flat" onPress={handleSearch}>
          Search
        </Button>
      </div>

      {/* Table */}
      <Table aria-label="Blog Posts Table" className="shadow-md rounded-2xl">
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>TITLE</TableColumn>
          <TableColumn>CATEGORY</TableColumn>
          <TableColumn>AUTHOR</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>FEATURED</TableColumn>
          <TableColumn>VIEWS</TableColumn>
          <TableColumn>DATE</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>

        <TableBody emptyContent="No blog posts found." isLoading={loading}>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell>{post.id}</TableCell>
              <TableCell>
                <div className="max-w-[200px]">
                  <p className="font-medium truncate">{post.title}</p>
                  <p className="text-xs text-gray-500">{post.read_time}</p>
                </div>
              </TableCell>
              <TableCell>
                <Chip
                  size="sm"
                  variant="flat"
                  color={
                    post.category?.color === "violet"
                      ? "secondary"
                      : post.category?.color === "emerald"
                      ? "success"
                      : post.category?.color === "sky"
                      ? "primary"
                      : "default"
                  }
                >
                  {post.category?.name || "Uncategorized"}
                </Chip>
              </TableCell>
              <TableCell>{post.author?.name || "Unknown"}</TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="flat"
                  color={post.is_published ? "success" : "warning"}
                  isLoading={togglingPublished === post.id}
                  onPress={() => handleTogglePublished(post)}
                >
                  {post.is_published ? "Published" : "Draft"}
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="light"
                  isIconOnly
                  isLoading={togglingFeatured === post.id}
                  onPress={() => handleToggleFeatured(post)}
                >
                  {post.is_featured ? (
                    <Star
                      size={18}
                      className="text-yellow-500 fill-yellow-500"
                    />
                  ) : (
                    <StarOff size={18} className="text-gray-400" />
                  )}
                </Button>
              </TableCell>
              <TableCell>{post.views_count.toLocaleString()}</TableCell>
              <TableCell>
                {post.published_at
                  ? formatDate(post.published_at)
                  : formatDate(post.created_at)}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="flat"
                    color="primary"
                    isIconOnly
                    onPress={() => setEditingPost(post)}
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    color="danger"
                    isIconOnly
                    onPress={() => setDeletingPost(post)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
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

      {/* Create Modal */}
      {isCreateModalOpen && (
        <CreateBlogModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreated={() => fetchPosts(page)}
        />
      )}

      {/* Edit Modal */}
      {editingPost && (
        <EditBlogModal
          post={editingPost}
          isOpen={!!editingPost}
          onClose={() => setEditingPost(null)}
          onUpdated={() => fetchPosts(page)}
        />
      )}

      {/* Delete Modal */}
      {deletingPost && (
        <DeleteBlogModal
          post={deletingPost}
          onClose={() => setDeletingPost(null)}
          onDeleted={() => fetchPosts(page)}
        />
      )}
    </div>
  );
}
