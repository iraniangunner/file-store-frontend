import { Metadata } from "next";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, Eye, User, ArrowLeft, Tag } from "lucide-react";

// Dynamic imports for client components (code splitting & lazy loading)
const ShareButtons = dynamic(() => import("./_components/ShareButtons"), {
  ssr: false,
  loading: () => (
    <div className="flex gap-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="w-9 h-9 bg-gray-100 rounded-lg animate-pulse" />
      ))}
    </div>
  ),
});

const RelatedPosts = dynamic(() => import("./_components/RelatedPosts"), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-gray-100 rounded-xl h-80 animate-pulse" />
      ))}
    </div>
  ),
});

const TableOfContents = dynamic(() => import("./_components/TableOfContents"), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="w-32 h-6 bg-gray-100 rounded mb-4 animate-pulse" />
      <div className="space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    </div>
  ),
});

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  category: {
    id: number;
    name: string;
    slug: string;
    color: string;
  };
  author: {
    id: number;
    name: string;
    avatar?: string;
    bio?: string;
  };
  tags: {
    id: number;
    name: string;
    slug: string;
  }[];
  is_featured: boolean;
  published_at: string;
  formatted_date: string;
  read_time: string;
  views_count: number;
}

interface Props {
  params: { slug: string };
}

// Data fetching (server-side)
async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/blog/posts/${slug}`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) return null;
    const data = await res.json();
    return data.data || null;
  } catch {
    return null;
  }
}

async function getRelatedPosts(slug: string): Promise<BlogPost[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/blog/posts/${slug}/related`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: `${post.title} | Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.published_at,
      authors: [post.author?.name],
      images: post.cover_image_url ? [post.cover_image_url] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.cover_image_url ? [post.cover_image_url] : [],
    },
  };
}

// Helper for category colors
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
export default async function BlogDetailPage({ params }: Props) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(params.slug);
  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative">
        {/* Cover Image */}
        <div className="relative h-[50vh] min-h-[400px] max-h-[600px] mt-[65px]">
          {post.cover_image_url ? (
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              priority
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-800" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        </div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
            {/* Back Button */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>

            {/* Category */}
            <div className="mb-4">
              <Link href={`/blog?category=${post.category?.slug}`}>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(
                    post.category?.color
                  )}`}
                >
                  {post.category?.name}
                </span>
              </Link>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-white/80">
              <div className="flex items-center gap-2">
                {post.author?.avatar ? (
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
                <span className="font-medium text-white">
                  {post.author?.name}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {post.formatted_date}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.read_time}
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {post.views_count?.toLocaleString() || 0} views
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar - Table of Contents (Client Component) */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24">
              <TableOfContents content={post.content} />

              {/* Share Buttons (Client Component) */}
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
                  Share this article
                </h3>
                <ShareButtons url={shareUrl} title={post.title} />
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <article className="lg:col-span-9">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
              {/* Excerpt */}
              <p className="text-xl text-gray-600 mb-8 leading-relaxed border-l-4 border-violet-500 pl-6 italic">
                {post.excerpt}
              </p>

              {/* Article Content */}
              <div
                className="prose prose-lg prose-violet max-w-none
                  prose-headings:font-bold prose-headings:text-gray-900
                  prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
                  prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
                  prose-p:text-gray-700 prose-p:leading-relaxed
                  prose-a:text-violet-600 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-gray-900
                  prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                  prose-pre:bg-gray-900 prose-pre:text-gray-100
                  prose-blockquote:border-l-violet-500 prose-blockquote:text-gray-600 prose-blockquote:italic
                  prose-img:rounded-xl prose-img:shadow-lg
                  prose-ul:my-6 prose-ol:my-6
                  prose-li:text-gray-700"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Tag className="w-5 h-5 text-gray-500" />
                    <span className="font-semibold text-gray-700">Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag.id}
                        href={`/blog?tag=${tag.slug}`}
                        className="px-4 py-2 bg-gray-100 hover:bg-violet-100 text-gray-700 hover:text-violet-700 rounded-full text-sm transition-colors"
                      >
                        #{tag.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Mobile Share Buttons */}
              <div className="lg:hidden mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
                  Share this article
                </h3>
                <ShareButtons url={shareUrl} title={post.title} />
              </div>

              {/* Author Bio */}
              {post.author && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex items-start gap-4">
                    {post.author.avatar ? (
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        width={64}
                        height={64}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                        <User className="w-8 h-8 text-violet-600" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Written by</p>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {post.author.name}
                      </h3>
                      {post.author.bio && (
                        <p className="text-gray-600 mt-2">{post.author.bio}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </article>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Related Articles
            </h2>
            <RelatedPosts posts={relatedPosts} />
          </div>
        </section>
      )}
    </main>
  );
}
