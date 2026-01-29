'use client';

import { useState } from 'react';
import { Bookmark, History, FileText, BookOpen, UserPlus, TrendingUp, Eye, Heart, MessageCircle, Zap, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PostCard } from '@/components/post-card';
import { StatsChart } from '@/components/dashboard/stats-chart';
import { EngagementCard } from '@/components/dashboard/engagement-card';
import { Avatar } from '@/components/ui/avatar';
import { FollowButton } from '@/components/follow-button';
import Link from 'next/link';
import type { PostWithAuthor } from '@/types';

type TabType = 'overview' | 'posts' | 'library' | 'following';

interface DashboardClientProps {
  analytics: {
    totalPosts: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    recentPosts: Array<{
      id: string;
      title: string;
      views: number;
      createdAt: Date;
      _count: {
        likes: number;
        comments: number;
      };
    }>;
    postsLast30Days: number;
    viewsLast30Days: number;
    likesLast30Days: number;
    commentsLast30Days: number;
    viewsChart?: {
      data: number[];
      labels: string[];
    };
  };
  userPosts: PostWithAuthor[];
  bookmarks: PostWithAuthor[];
  readingHistory: Array<PostWithAuthor & { readAt?: Date }>;
  following: Array<{
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    bio: string | null;
    _count: {
      posts: number;
      followers: number;
      following: number;
    };
  }>;
  isWriter: boolean;
}

export function DashboardClient({
  analytics,
  userPosts,
  bookmarks,
  readingHistory,
  following,
  isWriter,
}: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: TrendingUp },
    { id: 'posts' as TabType, label: 'My Posts', icon: FileText, count: userPosts.length },
    { id: 'library' as TabType, label: 'Library', icon: BookOpen, count: bookmarks.length + readingHistory.length },
    { id: 'following' as TabType, label: 'Following', icon: UserPlus, count: following.length },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-3 px-6 py-4 border-b-2 transition-all whitespace-nowrap
                  ${isActive
                    ? 'border-primary-600 text-primary-600 bg-primary-50 dark:bg-primary-900/20 font-semibold'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }
                `}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-primary-600' : ''}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <Badge
                    variant={isActive ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {tab.count}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Enhanced Stats Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isWriter && (
              <>
                <EngagementCard
                  title="Total Posts"
                  current={analytics.totalPosts}
                  previous={analytics.postsLast30Days || 0}
                  icon={FileText}
                  color="bg-blue-600"
                />
                <EngagementCard
                  title="Total Views"
                  current={analytics.totalViews}
                  previous={analytics.viewsLast30Days || 0}
                  icon={Eye}
                  color="bg-green-600"
                />
                <EngagementCard
                  title="Total Likes"
                  current={analytics.totalLikes}
                  previous={analytics.likesLast30Days || 0}
                  icon={Heart}
                  color="bg-red-600"
                />
                <EngagementCard
                  title="Total Comments"
                  current={analytics.totalComments}
                  previous={analytics.commentsLast30Days || 0}
                  icon={MessageCircle}
                  color="bg-purple-600"
                />
              </>
            )}
            {!isWriter && (
              <>
                <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Bookmarks
                    </CardTitle>
                    <div className="p-2 rounded-lg bg-yellow-600">
                      <Bookmark className="h-5 w-5 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{bookmarks.length}</div>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Reading History
                    </CardTitle>
                    <div className="p-2 rounded-lg bg-blue-600">
                      <History className="h-5 w-5 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{readingHistory.length}</div>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Following
                    </CardTitle>
                    <div className="p-2 rounded-lg bg-purple-600">
                      <UserPlus className="h-5 w-5 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{following.length}</div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Charts Section - Only for Writers */}
          {isWriter && analytics.viewsChart && analytics.viewsChart.data && (
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary-600" />
                    Views Over Last 7 Days
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <StatsChart
                    data={analytics.viewsChart.data}
                    labels={analytics.viewsChart.labels}
                    type="line"
                    title="Views"
                    color="#3b82f6"
                  />
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary-600" />
                    Recent Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analytics.recentPosts && analytics.recentPosts.length > 0 ? (
                    <div className="space-y-3">
                      {analytics.recentPosts.map((post) => (
                        <div
                          key={post.id}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/post/${post.id}`}
                              className="font-medium text-sm hover:text-primary-600 transition-colors truncate block"
                            >
                              {post.title}
                            </Link>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {post.views}
                              </span>
                              <span className="flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                {post._count.likes}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageCircle className="h-3 w-3" />
                                {post._count.comments}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-8">No recent posts</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Quick Access Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-xl transition-all cursor-pointer border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <Link href="/library?tab=bookmarks">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Bookmark className="h-8 w-8 text-blue-600" />
                    <ArrowRight className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">My Bookmarks</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {bookmarks.length} saved posts
                  </p>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:shadow-xl transition-all cursor-pointer border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
              <Link href="/library?tab=history">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <History className="h-8 w-8 text-green-600" />
                    <ArrowRight className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">Reading History</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {readingHistory.length} posts read
                  </p>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:shadow-xl transition-all cursor-pointer border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
              <Link href="/library?tab=following">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <UserPlus className="h-8 w-8 text-purple-600" />
                    <ArrowRight className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">Following</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {following.length} writers
                  </p>
                </CardContent>
              </Link>
            </Card>
          </div>
        </div>
      )}

      {/* Posts Tab */}
      {activeTab === 'posts' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Your Posts</h2>
            {isWriter && (
              <Button asChild>
                <Link href="/write">
                  <FileText className="mr-2 h-4 w-4" />
                  New Post
                </Link>
              </Button>
            )}
          </div>
          {userPosts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userPosts.map((post) => (
                <PostCard key={post.id} post={post} compact />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {isWriter ? "Start writing your first post!" : "You haven't created any posts yet"}
              </p>
              {isWriter && (
                <Button asChild>
                  <Link href="/write">Write Your First Post</Link>
                </Button>
              )}
            </Card>
          )}
        </div>
      )}

      {/* Library Tab */}
      {activeTab === 'library' && (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">My Library</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Your bookmarks and reading history
            </p>
          </div>

          {/* Bookmarks Section */}
          {bookmarks.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Bookmark className="h-5 w-5 text-primary-600" />
                  Bookmarks ({bookmarks.length})
                </h3>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/library?tab=bookmarks">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarks.slice(0, 6).map((post) => (
                  <PostCard key={post.id} post={post} compact />
                ))}
              </div>
            </div>
          )}

          {/* Reading History Section */}
          {readingHistory.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <History className="h-5 w-5 text-primary-600" />
                  Reading History ({readingHistory.length})
                </h3>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/library?tab=history">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {readingHistory.slice(0, 6).map((post) => (
                  <PostCard key={post.id} post={post} compact />
                ))}
              </div>
            </div>
          )}

          {bookmarks.length === 0 && readingHistory.length === 0 && (
            <Card className="p-12 text-center">
              <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Your library is empty</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start bookmarking posts and reading to build your library
              </p>
              <Button variant="outline" asChild>
                <Link href="/explore">Explore Stories</Link>
              </Button>
            </Card>
          )}
        </div>
      )}

      {/* Following Tab */}
      {activeTab === 'following' && (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Writers You Follow</h2>
            <p className="text-gray-600 dark:text-gray-400">
              {following.length} {following.length === 1 ? 'writer' : 'writers'}
            </p>
          </div>

          {following.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {following.map((user) => (
                <Card key={user.id} className="hover:shadow-lg transition-shadow border-0 shadow-md">
                  <CardContent className="p-6">
                    <Link href={`/author/${user.id}`} className="block">
                      <div className="flex items-center space-x-4 mb-4">
                        <Avatar
                          src={user.image}
                          alt={user.name || 'User'}
                          fallback={user.name?.charAt(0) || 'U'}
                          className="h-16 w-16"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg truncate hover:text-primary-600 transition-colors">
                            {user.name || user.email}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {user._count.posts} {user._count.posts === 1 ? 'post' : 'posts'}
                          </p>
                        </div>
                      </div>
                      {user.bio && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                          {user.bio}
                        </p>
                      )}
                    </Link>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {user._count.followers} followers
                      </div>
                      <FollowButton userId={user.id} size="sm" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <UserPlus className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Not following anyone yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start following writers to see their latest posts
              </p>
              <Button variant="outline" asChild>
                <Link href="/explore">Explore Writers</Link>
              </Button>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

