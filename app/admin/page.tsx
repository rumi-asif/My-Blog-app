import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { CommentActions } from '@/components/admin/comment-actions';
import { AutoFeatureButton } from '@/components/admin/auto-feature-button';
import {
  Users,
  FileText,
  MessageCircle,
  TrendingUp,
  Shield,
  Settings,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { formatRelativeTime } from '@/lib/utils';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  const [
    totalUsers,
    totalPosts,
    totalComments,
    recentUsers,
    recentPosts,
    pendingComments,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.post.count(),
    prisma.comment.count(),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.post.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        author: true,
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    }),
    prisma.comment.findMany({
      where: { approved: false },
      include: {
        author: true,
        post: true,
      },
      take: 10,
    }),
  ]);

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers,
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Total Posts',
      value: totalPosts,
      icon: FileText,
      color: 'text-green-600',
    },
    {
      title: 'Total Comments',
      value: totalComments,
      icon: MessageCircle,
      color: 'text-purple-600',
    },
    {
      title: 'Pending Moderation',
      value: pendingComments.length,
      icon: Shield,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <Shield className="mr-3 h-8 w-8" />
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your blog platform
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/admin/settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Auto-Feature Tool */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-purple-600" />
              Auto-Feature Posts
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Automatically feature posts based on engagement metrics. Posts need 100+ views OR 50+ likes OR 20+ comments, plus an engagement score of 500+. Only top 3 posts from the last 30 days will be featured.
            </p>
          </CardHeader>
          <CardContent>
            <AutoFeatureButton />
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Recent Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>
                    <Badge variant="secondary">{user.role}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Posts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Recent Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <Link
                        href={`/post/${post.slug}`}
                        className="font-medium hover:text-primary-600 transition-colors"
                      >
                        {post.title}
                      </Link>
                      <Badge variant={post.status === 'PUBLISHED' ? 'success' : 'secondary'}>
                        {post.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>by {post.author.name}</span>
                      <span>{formatRelativeTime(post.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Moderation */}
        {pendingComments.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-orange-600" />
                Pending Comment Moderation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingComments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-4 border border-orange-200 dark:border-orange-900 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium">{comment.author.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          on "{comment.post.title}"
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatRelativeTime(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm mb-3">{comment.content}</p>
位於 <CommentActions commentId={comment.id} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

