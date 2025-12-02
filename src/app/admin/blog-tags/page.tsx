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
} from "@heroui/react";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
import type { User } from "@/types";
import api from "@/lib/api";
import type { InternalAxiosRequestConfig } from "axios";
import { EditBlogTagModal } from "../_components/edit-blog-tag-modal";
import { DeleteBlogTagModal } from "../_components/delete-blog-tag-modal";
import { CreateBlogTagModal } from "../_components/create-blog-tag-modal";
import toast from "react-hot-toast";

interface BlogTag {
  id: number;
  name: string;
  slug: string;
  posts_count?: number;
  created_at: string;
  updated_at: string;
}

export default function BlogTagsTable() {
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [editingTag, setEditingTag] = useState<BlogTag | null>(null);
  const [deletingTag, setDeletingTag] = useState<BlogTag | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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

  // Fetch tags
  const fetchTags = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (searchQuery) {
        params.append("search", searchQuery);
      }

      const res = await api.get(`/blog/tags?${params.toString()}`, {
        requiresAuth: true,
      } as InternalAxiosRequestConfig);

      setTags(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch tags:", err);
      toast.error("Failed to fetch tags");
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchTags();
    }
  }, [user, fetchTags]);

  // Handle search
  const handleSearch = () => {
    fetchTags();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading && !tags.length) {
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
        <h1 className="text-2xl font-bold">Blog Tags</h1>
        <Button
          color="primary"
          startContent={<Plus size={18} />}
          onPress={() => setIsCreateModalOpen(true)}
        >
          New Tag
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <Input
          placeholder="Search tags..."
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
      <Table aria-label="Blog Tags Table" className="shadow-md rounded-2xl">
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>NAME</TableColumn>
          <TableColumn>SLUG</TableColumn>
          <TableColumn>POSTS</TableColumn>
          <TableColumn>CREATED</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>

        <TableBody emptyContent="No tags found." isLoading={loading}>
          {tags.map((tag) => (
            <TableRow key={tag.id}>
              <TableCell>{tag.id}</TableCell>
              <TableCell>
                <span className="font-medium">{tag.name}</span>
              </TableCell>
              <TableCell>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {tag.slug}
                </code>
              </TableCell>
              <TableCell>{tag.posts_count ?? 0}</TableCell>
              <TableCell>{formatDate(tag.created_at)}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="flat"
                    color="primary"
                    isIconOnly
                    onPress={() => setEditingTag(tag)}
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    color="danger"
                    isIconOnly
                    onPress={() => setDeletingTag(tag)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Stats */}
      <div className="text-sm text-gray-500">
        Total: {tags.length} tag(s)
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <CreateBlogTagModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreated={() => fetchTags()}
        />
      )}

      {/* Edit Modal */}
      {editingTag && (
        <EditBlogTagModal
          tag={editingTag}
          isOpen={!!editingTag}
          onClose={() => setEditingTag(null)}
          onUpdated={() => fetchTags()}
        />
      )}

      {/* Delete Modal */}
      {deletingTag && (
        <DeleteBlogTagModal
          tag={deletingTag}
          onClose={() => setDeletingTag(null)}
          onDeleted={() => fetchTags()}
        />
      )}
    </div>
  );
}
