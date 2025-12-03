import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, Eye, Star, Search } from "lucide-react";
import BlogFilters from "./_components/BlogFilters";
import BlogPagination from "./_components/BlogPagination";
import BlogSearch from "./_components/BlogSearch";
import FeaturedPostsCarousel from "./_components/FeaturedPostsCarousel";
import ActiveFilters from "./_components/ActiveFilters";

export const metadata: Metadata = {
  title: "Blog | Our Latest Articles",
  description: "Explore our latest articles, tutorials, and insights.",
};

interface BlogPageProps {
  searchParams: {
    page?: string;
    category?: string;
    tag?: string;
    search?: string;
    featured?: string;
  };
}

// Types
interface Category {
  id: number;
  name: string;
  slug: string;
  color: string;
  posts_count?: number;
}

interface BlogTag {
  id: number;
  name: string;
  slug: string;
  posts_count?: number;
}

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url: string | null;
  category: Category;
  author: { id: number; name: string };
  is_featured: boolean;
  published_at: string;
  formatted_date: string;
  read_time: string;
  views_count: number;
  tags?: BlogTag[];
}

interface Meta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// Data fetching functions (run on server)
async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/categories`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

async function getTags(): Promise<BlogTag[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/tags`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

async function getPosts(params: BlogPageProps["searchParams"]): Promise<{ posts: BlogPost[]; meta: Meta | null }> {
  try {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append("page", params.page);
    if (params.category) searchParams.append("category", params.category);
    if (params.tag) searchParams.append("tag", params.tag);
    if (params.search) searchParams.append("search", params.search);
    if (params.featured === "true") searchParams.append("featured", "true");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/blog/posts?${searchParams.toString()}`,
      { next: { revalidate: 60 } }
    );
    
    if (!res.ok) return { posts: [], meta: null };
    const data = await res.json();
    return {
      posts: data.data || [],
      meta: data.meta || null,
    };
  } catch {
    return { posts: [], meta: null };
  }
}

async function getFeaturedPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/blog/posts/featured?limit=3`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

// Helper function for category colors
function getCategoryColor(color: string): string {
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
}

// Main Page Component (Server Component)
export default async function BlogPage({ searchParams }: BlogPageProps) {
  // All data fetched on server
  const [categories, tags, { posts, meta }, featuredPosts] = await Promise.all([
    getCategories(),
    getTags(),
    getPosts(searchParams),
    getFeaturedPosts(),
  ]);

  const currentFilters = {
    category: searchParams.category || "",
    tag: searchParams.tag || "",
    search: searchParams.search || "",
    featured: searchParams.featured === "true",
    page: parseInt(searchParams.page || "1"),
  };

  const hasActiveFilters = currentFilters.category || currentFilters.tag || currentFilters.search || currentFilters.featured;

  // Find names for active filters
  const activeCategoryName = categories.find(c => c.slug === currentFilters.category)?.name;
  const activeTagName = tags.find(t => t.slug === currentFilters.tag)?.name;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-[65px] md:py-24 bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-800 text-white">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Our Blog
            </h1>
            <p className="text-lg md:text-xl text-violet-100 max-w-2xl mx-auto">
              Discover insights, tutorials, and the latest updates from our team
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Posts - Only show when no filters active */}
        {featuredPosts.length > 0 && !hasActiveFilters && (
          <section className="mb-16">
            <div className="flex items-center gap-2 mb-6">
              <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-900">Featured Posts</h2>
            </div>
            {/* Client Component for carousel/interaction */}
            <FeaturedPostsCarousel posts={featuredPosts} />
          </section>
        )}

        {/* Filters Section */}
        <section className="mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {/* Search - Client Component */}
            <BlogSearch initialSearch={currentFilters.search} />

            {/* Filters - Client Component */}
            <BlogFilters
              categories={categories}
              tags={tags}
              currentCategory={currentFilters.category}
              currentTag={currentFilters.tag}
              currentFeatured={currentFilters.featured}
            />

            {/* Active Filters Display - Client Component */}
            {hasActiveFilters && (
              <ActiveFilters
                category={activeCategoryName}
                categorySlug={currentFilters.category}
                tag={activeTagName}
                tagSlug={currentFilters.tag}
                search={currentFilters.search}
                featured={currentFilters.featured}
              />
            )}
          </div>
        </section>

        {/* Results Info */}
        {meta && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              Showing <span className="font-semibold">{posts.length}</span> of{" "}
              <span className="font-semibold">{meta.total}</span> articles
            </p>
          </div>
        )}

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filter criteria
            </p>
            {hasActiveFilters && (
              <Link
                href="/blog"
                className="inline-flex items-center px-4 py-2 bg-violet-100 text-violet-700 rounded-lg hover:bg-violet-200 transition-colors"
              >
                Clear all filters
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                <article className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    {post.cover_image_url ? (
                      <Image
                        src={post.cover_image_url}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-violet-500 to-indigo-600" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Category & Featured Badge */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category?.color)}`}>
                        {post.category?.name}
                      </span>
                      {post.is_featured && (
                        <div className="bg-yellow-500 text-white p-1 rounded-full">
                          <Star className="w-3 h-3 fill-white" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-xl text-gray-900 line-clamp-2 group-hover:text-violet-600 transition-colors mb-3">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
                      {post.excerpt}
                    </p>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag.id}
                            className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full"
                          >
                            #{tag.name}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                            +{post.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Meta */}
                    <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {post.formatted_date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {post.read_time}
                        </span>
                      </div>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {post.views_count?.toLocaleString() || 0}
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination - Client Component */}
        {meta && meta.last_page > 1 && (
          <div className="mt-12">
            <BlogPagination
              currentPage={currentFilters.page}
              totalPages={meta.last_page}
            />
          </div>
        )}

        {/* Mobile Category/Tag Browser */}
        <div className="lg:hidden mt-12">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-lg mb-4">Browse by Category</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/blog?category=${cat.slug}`}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    currentFilters.category === cat.slug
                      ? "bg-violet-600 text-white"
                      : getCategoryColor(cat.color) + " hover:opacity-80"
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            <h3 className="font-bold text-lg mt-6 mb-4">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 12).map((tag) => (
                <Link
                  key={tag.id}
                  href={`/blog?tag=${tag.slug}`}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    currentFilters.tag === tag.slug
                      ? "bg-violet-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
