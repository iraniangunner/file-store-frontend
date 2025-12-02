"use client";

import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  Button,
  Switch,
  Chip,
  Checkbox,
} from "@heroui/react";
import { X, Image as ImageIcon, Search, Tag } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface BlogCategory {
  id: number;
  name: string;
  slug: string;
}

interface BlogTag {
  id: number;
  name: string;
  slug: string;
}

interface CreateBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export function CreateBlogModal({
  isOpen,
  onClose,
  onCreated,
}: CreateBlogModalProps) {
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    category_id: 0,
    is_featured: false,
    is_published: false,
    selectedTagIds: [] as number[],
  });
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [availableTags, setAvailableTags] = useState<BlogTag[]>([]);
  const [tagSearch, setTagSearch] = useState("");

  // Fetch categories and tags
  useEffect(() => {
    if (isOpen) {
      api.get("/blog/categories").then((res) => {
        if (res.data.success) {
          setCategories(res.data.data);
        }
      });

      api.get("/blog/tags").then((res) => {
        if (res.data.success) {
          setAvailableTags(res.data.data);
        }
      });
    }
  }, [isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setForm({
        title: "",
        excerpt: "",
        content: "",
        category_id: 0,
        is_featured: false,
        is_published: false,
        selectedTagIds: [],
      });
      setCoverImage(null);
      setCoverPreview(null);
      setTagSearch("");
    }
  }, [isOpen]);

  // Handle cover image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  // Handle tag selection
  const handleTagToggle = (tagId: number) => {
    setForm((prev) => ({
      ...prev,
      selectedTagIds: prev.selectedTagIds.includes(tagId)
        ? prev.selectedTagIds.filter((id) => id !== tagId)
        : [...prev.selectedTagIds, tagId],
    }));
  };

  // Remove selected tag
  const handleRemoveTag = (tagId: number) => {
    setForm((prev) => ({
      ...prev,
      selectedTagIds: prev.selectedTagIds.filter((id) => id !== tagId),
    }));
  };

  // Filter tags based on search
  const filteredTags = availableTags.filter((tag) =>
    tag.name.toLowerCase().includes(tagSearch.toLowerCase())
  );

  // Get selected tag objects
  const selectedTags = availableTags.filter((tag) =>
    form.selectedTagIds.includes(tag.id)
  );

  // Handle form submission
  const handleSubmit = async () => {
    if (!form.title || !form.excerpt || !form.content || !form.category_id) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("excerpt", form.excerpt);
      formData.append("content", form.content);
      formData.append("category_id", form.category_id.toString());
      formData.append("is_featured", form.is_featured ? "1" : "0");
      formData.append("is_published", form.is_published ? "1" : "0");

      if (form.is_published) {
        formData.append("published_at", new Date().toISOString());
      }

      // Send tag IDs
      form.selectedTagIds.forEach((tagId) => {
        formData.append("tags[]", tagId.toString());
      });

      if (coverImage) {
        formData.append("cover_image", coverImage);
      }

      await api.post("/blog/posts", formData, {
        requiresAuth: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      } as any);

      toast.success("Blog post created successfully");
      onCreated?.();
      onClose();
    } catch (error: any) {
      console.error("Error creating post:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to create blog post");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      size="3xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader>Create New Blog Post</ModalHeader>
        <ModalBody className="flex flex-col gap-4">
          {/* Title */}
          <Input
            label="Title"
            placeholder="Enter post title"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            isRequired
          />

          {/* Excerpt */}
          <Textarea
            label="Excerpt"
            placeholder="Brief description of the post"
            value={form.excerpt}
            onChange={(e) =>
              setForm((p) => ({ ...p, excerpt: e.target.value }))
            }
            maxRows={3}
            isRequired
          />

          {/* Content */}
          <Textarea
            label="Content"
            placeholder="Write your blog post content here... (Markdown supported)"
            value={form.content}
            onChange={(e) =>
              setForm((p) => ({ ...p, content: e.target.value }))
            }
            minRows={10}
            maxRows={20}
            isRequired
          />

          {/* Category */}
          <div>
            <label className="text-sm font-medium mb-1 block">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={form.category_id}
              onChange={(e) =>
                setForm((p) => ({ ...p, category_id: Number(e.target.value) }))
              }
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value={0}>Select a category</option>
              {categories
                .filter((cat: any) => cat.is_active) 
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Tags Selection */}
          <div>
            <label className="text-sm font-medium mb-2 flex items-center gap-2">
              <Tag size={16} />
              Tags
            </label>

            {/* Selected Tags */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedTags.map((tag) => (
                  <Chip
                    key={tag.id}
                    onClose={() => handleRemoveTag(tag.id)}
                    variant="flat"
                    color="primary"
                  >
                    {tag.name}
                  </Chip>
                ))}
              </div>
            )}

            {/* Tag Search */}
            <Input
              placeholder="Search tags..."
              value={tagSearch}
              onChange={(e) => setTagSearch(e.target.value)}
              startContent={<Search size={16} className="text-gray-400" />}
              size="sm"
              className="mb-2"
            />

            {/* Tags List */}
            <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
              {filteredTags.length > 0 ? (
                <div className="p-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {filteredTags.map((tag) => (
                    <div
                      key={tag.id}
                      className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                        form.selectedTagIds.includes(tag.id)
                          ? "bg-primary-100 border border-primary-300"
                          : "bg-gray-50 hover:bg-gray-100 border border-transparent"
                      }`}
                      onClick={() => handleTagToggle(tag.id)}
                    >
                      <Checkbox
                        isSelected={form.selectedTagIds.includes(tag.id)}
                        onValueChange={() => handleTagToggle(tag.id)}
                        size="sm"
                      />
                      <span className="text-sm truncate">{tag.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500 text-sm">
                  {tagSearch ? "No tags found" : "No tags available"}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {form.selectedTagIds.length} tag(s) selected
            </p>
          </div>

          {/* Cover Image */}
          <div>
            <label className="text-sm font-medium mb-1 block">
              Cover Image
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              {coverPreview ? (
                <div className="relative">
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    size="sm"
                    color="danger"
                    variant="flat"
                    isIconOnly
                    className="absolute top-2 right-2"
                    onPress={() => {
                      setCoverImage(null);
                      setCoverPreview(null);
                    }}
                  >
                    <X size={16} />
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-32 cursor-pointer">
                  <ImageIcon size={32} className="text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">
                    Click to upload cover image
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Switches */}
          <div className="flex gap-6">
            <Switch
              isSelected={form.is_featured}
              onValueChange={(checked) =>
                setForm((p) => ({ ...p, is_featured: checked }))
              }
            >
              Featured Post
            </Switch>
            <Switch
              isSelected={form.is_published}
              onValueChange={(checked) =>
                setForm((p) => ({ ...p, is_published: checked }))
              }
            >
              Publish Immediately
            </Switch>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={onClose} isDisabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            isLoading={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Post"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
