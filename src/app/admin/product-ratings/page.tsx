"use client";
import { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
} from "@heroui/react";
import { Pagination } from "@heroui/pagination";
import type { User, Product } from "@/types";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface Rating {
  id: number;
  rating: number;
  user: User;
  product: Product;
  created_at: string;
}

export default function RatingsTable() {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Fetch ratings (admin only)
  const fetchRatings = useCallback(async (pageNumber = 1) => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/ratings?page=${pageNumber}`);
      const data = res.data.ratings;
      setRatings(data.data || []);
      setTotalPages(data.last_page || 1);
      setPage(data.current_page || 1);
    } catch (err) {
      console.error("Failed to fetch ratings:", err);
      toast.error("Failed to fetch ratings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchRatings(page);
    }
  }, [page, user, fetchRatings]);

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
        <Spinner size="lg" color="primary" />
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
      <h1 className="text-2xl font-bold">User Ratings</h1>

      <Table aria-label="Ratings Table" className="shadow-md rounded-2xl">
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>USER</TableColumn>
          <TableColumn>PRODUCT</TableColumn>
          <TableColumn>RATING</TableColumn>
          <TableColumn>DATE</TableColumn>
        </TableHeader>

        <TableBody emptyContent="No ratings found.">
          {ratings.map((rating) => (
            <TableRow key={rating.id}>
              <TableCell>{rating.id}</TableCell>
              <TableCell>{rating.user?.name || "Unknown"}</TableCell>
              <TableCell className="max-w-[200px] truncate">
                {rating.product?.title || "Unknown"}
              </TableCell>
              <TableCell>{rating.rating} ⭐</TableCell>
              <TableCell>{formatDate(rating.created_at)}</TableCell>
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
    </div>
  );
}
