"use client";

import { Card, CardBody, CardFooter } from "@heroui/react";
import { Calendar, Clock, Star, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";

interface Category {
  id: number;
  name: string;
  slug: string;
  color: string;
}

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url: string | null;
  category: Category;
  formatted_date: string;
  read_time: string;
}

interface FeaturedPostsCarouselProps {
  posts: BlogPost[];
}

export default function FeaturedPostsCarousel({
  posts,
}: FeaturedPostsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <div className="relative group">
      {/* Scroll Buttons */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1/2"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-1/2"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>
      )}

      {/* Cards Container */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] snap-start"
          >
            <Card className="h-full hover:shadow-lg transition-shadow duration-300 group/card">
              <div className="relative h-48 overflow-hidden">
                {post.cover_image_url ? (
                  <Image
                    src={post.cover_image_url}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover/card:scale-105 transition-transform duration-300"
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
                <div className="absolute top-3 right-3">
                  <div className="bg-yellow-500 text-white p-1.5 rounded-full">
                    <Star className="w-4 h-4 fill-white" />
                  </div>
                </div>
              </div>
              <CardBody className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 group-hover/card:text-violet-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                  {post.excerpt}
                </p>
              </CardBody>
              <CardFooter className="px-4 pb-4 pt-0">
                <div className="flex items-center justify-between w-full text-xs text-gray-500">
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
    </div>
  );
}
