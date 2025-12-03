"use client";

import { Card, CardBody, CardFooter } from "@heroui/react";
import { Calendar, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Category {
  name: string;
  slug: string;
  color: string;
}

interface RelatedPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url: string | null;
  category: Category;
  formatted_date: string;
  read_time: string;
}

interface RelatedPostsProps {
  posts: RelatedPost[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  const getCategoryColor = (color: string): string => {
    const colors: Record<string, string> = {
      violet: "bg-violet-100 text-violet-700",
      emerald: "bg-emerald-100 text-emerald-700",
      sky: "bg-sky-100 text-sky-700",
      amber: "bg-amber-100 text-amber-700",
      rose: "bg-rose-100 text-rose-700",
      indigo: "bg-indigo-100 text-indigo-700",
      teal: "bg-teal-100 text-teal-700",
      orange: "bg-orange-100 text-orange-700",
    };
    return colors[color] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {posts.map((post) => (
        <Link key={post.id} href={`/blog/${post.slug}`} className="group">
          <Card className="h-full hover:shadow-lg transition-all duration-300">
            <div className="relative h-48 overflow-hidden rounded-t-xl">
              {post.cover_image_url ? (
                <Image
                  src={post.cover_image_url}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-violet-500 to-indigo-600" />
              )}
              <div className="absolute top-3 left-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                    post.category?.color
                  )}`}
                >
                  {post.category?.name}
                </span>
              </div>
            </div>

            <CardBody className="p-4">
              <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 group-hover:text-violet-600 transition-colors">
                {post.title}
              </h3>
              <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                {post.excerpt}
              </p>
            </CardBody>

            <CardFooter className="px-4 pb-4 pt-0">
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {post.formatted_date}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {post.read_time}
                </div>
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
