import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Avatar } from '@/components/ui/avatar';
import { PostCard } from '@/components/post-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FollowButton } from '@/components/follow-button';
import { 
  User, 
  Calendar, 
  FileText, 
  Heart, 
  MessageCircle, 
  Bookmark,
  Globe,
  Twitter,
  Github,
  Linkedin
} from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import type { PostWithAuthor } from '@/types';

interface AuthorPageProps {
  params: {
    id: string;
  };
}

async function getAuthor(id: string) {
  const author = await prisma.user.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          posts: true,
          comments: true,
          likes: true,
          bookmarks: true,
        },
      },
    },
  });

  return author;
}

async function getAuthorPosts(authorId: string): Promise<PostWithAuthor[]> {
  const posts = await prisma.post.findMany({
    where: {
      authorId,
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
    orderBy: { publishedAt: 'desc' },
  });

  return posts as PostWithAuthor[];
}

export async function generateMetadata({ params }: AuthorPageProps) {
  const author = await getAuthor(params.id);

  if (!author) {
    return {};
  }

  return {
    title: `${author.name || 'Author'} | NextGen Blog`,
    description: author.bio || `Posts by ${author.name || 'this author'}`,
  };
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const session = await getServerSession(authOptions);
  const author = await getAuthor(params.id);

  if (!author) {
    notFound();
  }

  const posts = await getAuthorPosts(author.id);
  
  // Get follower/following counts
  const [followerCount, followingCount] = await Promise.all([
    prisma.follow.count({
      where: { followingId: author.id },
    }),
    prisma.follow.count({
      where: { followerId: author.id },
    }),
  ]);

  const stats = [
    {
      label: 'Posts',
      value: author._count.posts,
      icon: FileText,
      color: 'text-blue-600',
    },
    {
      label: 'Comments',
      value: author._count.comments,
      icon: MessageCircle,
      color: 'text-purple-600',
    },
    {
      label: 'Likes',
      value: author._count.likes,
      icon: Heart,
      color: 'text-red-600',
    },
    {
      label: 'Bookmarks',
      value: author._count.bookmarks,
      icon: Bookmark,
      color: 'text-yellow-600',
    },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-6xl">
        {/* Author Header */}
        <div className="mb-8">
          <Card className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar
                src={author.image}
                alt={author.name || 'Author'}
                fallback={author.name?.charAt(0) || 'A'}
                className="h-32 w-32 text-3xl"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold">{author.name}</h1>
                    <Badge variant="secondary">{author.role}</Badge>
                  </div>
                  {session && session.user.id !== author.id && (
                    <FollowButton userId={author.id} />
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {author.bio || 'No bio available'}
                </p>
                <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Joined {formatDate(author.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {followerCount} {followerCount === 1 ? 'follower' : 'followers'}
                  </span>
                  <span className="flex items-center gap-1">
                    Following {followingCount}
                  </span>
                </div>
                {/* Social Links */}
                {(author.website || author.twitter || author.github || author.linkedin) && (
                  <div className="flex items-center gap-3 flex-wrap">
                    {author.website && (
                      <a
                        href={author.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors"
                      >
                        <Globe className="h-5 w-5" />
                      </a>
                    )}
                    {author.twitter && (
                      <a
                        href={`https://twitter.com/${author.twitter.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 dark:text-gray-400 hover:text-blue-400 transition-colors"
                      >
                        <Twitter className="h-5 w-5" />
                      </a>
                    )}
                    {author.github && (
                      <a
                        href={`https://github.com/${author.github.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                      >
                        <Github className="h-5 w-5" />
                      </a>
                    )}
                    {author.linkedin && (
                      <a
                        href={author.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                  <span className="text-3xl font-bold">{stat.value}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              </Card>
            );
          })}
        </div>

        {/* Posts Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Posts by {author.name}</h2>
            <Badge variant="secondary">{posts.length} total posts</Badge>
          </div>

          {posts.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {author.name} hasn't published any posts yet.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

