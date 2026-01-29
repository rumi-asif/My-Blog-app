import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Heart, MessageCircle, Bookmark, Share2, Clock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { generateSEO, generateArticleSchema } from '@/lib/seo';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import { trackPostView } from '@/lib/analytics';
import Link from 'next/link';
import { CommentSection } from '@/components/comments/comment-section';
import { PostActions } from '@/components/post/post-actions';
import { ShareButtons } from '@/components/post/share-buttons';
import { FollowButton } from '@/components/follow-button';

interface PostPageProps {
  params: {
    slug: string;
  };
}

async function getPost(slug: string) {
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: true,
      category: true,
      tags: true,
      _count: {
        select: {
          likes: true,
          comments: true,
          bookmarks: true,
        },
      },
    },
  });

  if (!post || post.status !== 'PUBLISHED') {
    return null;
  }

  return post;
}

async function getRelatedPosts(postId: string, categoryId: string | null) {
  if (!categoryId) return [];

  return await prisma.post.findMany({
    where: {
      id: { not: postId },
      categoryId,
      status: 'PUBLISHED',
    },
    include: {
      author: true,
      category: true,
      tags: true,
      _count: {
        select: {
          likes: true,
          comments: true,
          bookmarks: true,
        },
      },
    },
    take: 3,
    orderBy: { views: 'desc' },
  });
}

export async function generateMetadata({ params }: PostPageProps) {
  const post = await getPost(params.slug);

  if (!post) {
    return {};
  }

  return generateSEO({
    title: post.title,
    description: post.excerpt || post.content.substring(0, 160),
    image: post.coverImage || undefined,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/post/${post.slug}`,
    type: 'article',
    keywords: post.tags.map((tag) => tag.name),
    author: post.author.name || undefined,
    publishedTime: post.publishedAt?.toISOString(),
    modifiedTime: post.updatedAt.toISOString(),
  });
}

export default async function PostPage({ params }: PostPageProps) {
  const session = await getServerSession(authOptions);
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.id, post.categoryId);

  // Track page view and reading history (non-blocking)
  trackPostView(post.id).catch(console.error);
  if (session?.user?.id) {
    // Track reading history server-side to avoid timeout issues
    prisma.readingHistory.upsert({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId: post.id,
        },
      },
      update: {
        readAt: new Date(),
      },
      create: {
        userId: session.user.id,
        postId: post.id,
        readAt: new Date(),
      },
    }).catch(console.error);
  }

  // Generate structured data for SEO
  const articleSchema = generateArticleSchema({
    title: post.title,
    description: post.excerpt || '',
    author: { name: post.author.name || 'Anonymous', image: post.author.image || undefined },
    publishedAt: post.publishedAt || post.createdAt,
    updatedAt: post.updatedAt,
    image: post.coverImage || undefined,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/post/${post.slug}`,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <article className="min-h-screen">
        {/* Hero Section */}
        {post.coverImage && (
          <div className="relative h-[400px] w-full">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}

        {/* Content */}
        <div className="container max-w-4xl py-8">
          {/* Category Badge */}
          {post.category && (
            <Link href={`/explore?category=${post.category.slug}`}>
              <Badge variant="secondary" className="mb-4">
                {post.category.name}
              </Badge>
            </Link>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
            <Link
              href={`/author/${post.author.id}`}
              className="flex items-center space-x-3 hover:opacity-75 transition-opacity"
            >
              <Avatar
                src={post.author.image}
                alt={post.author.name || 'Author'}
                fallback={post.author.name?.charAt(0) || 'A'}
                className="h-12 w-12"
              />
              <div>
                <p className="font-medium">{post.author.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(post.publishedAt || post.createdAt)}
                </p>
              </div>
            </Link>

            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 ml-auto">
              <span className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{post.readTime} min read</span>
              </span>
              <span className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{post.views} views</span>
              </span>
            </div>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <Link key={tag.id} href={`/explore?tag=${tag.slug}`}>
                  <Badge variant="outline">{tag.name}</Badge>
                </Link>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between mb-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <PostActions postId={post.id} userId={session?.user.id} />
            <ShareButtons
              url={`${process.env.NEXT_PUBLIC_APP_URL}/post/${post.slug}`}
              title={post.title}
            />
          </div>

          {/* Post Content */}
          <div
            className="prose-custom mb-12"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Author Bio */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-12">
            <div className="flex items-start space-x-4">
              <Avatar
                src={post.author.image}
                alt={post.author.name || 'Author'}
                fallback={post.author.name?.charAt(0) || 'A'}
                className="h-16 w-16"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">
                    About {post.author.name}
                  </h3>
                  {session && session.user.id !== post.author.id && (
                    <FollowButton userId={post.author.id} size="sm" />
                  )}
                </div>
                {post.author.bio && (
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {post.author.bio}
                  </p>
                )}
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/author/${post.author.id}`}>View Profile</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Comments */}
          <CommentSection postId={post.id} />

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/post/${relatedPost.slug}`}
                    className="group"
                  >
                    {relatedPost.coverImage && (
                      <div className="relative h-48 rounded-lg overflow-hidden mb-3">
                        <img
                          src={relatedPost.coverImage}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    <h3 className="font-semibold group-hover:text-primary-600 transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {formatRelativeTime(relatedPost.publishedAt || relatedPost.createdAt)}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </>
  );
}

