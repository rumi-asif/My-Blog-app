'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Bookmark, History, FileText, BookOpen, Loader2, Users, UserPlus } from 'lucide-react';
import { PostCard } from '@/components/post-card';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { FollowButton } from '@/components/follow-button';
import type { PostWithAuthor } from '@/types';
import axios from 'axios';
import Link from 'next/link';

type TabType = 'bookmarks' | 'history' | 'saved' | 'my-posts' | 'following';

interface LibraryData {
  bookmarks: PostWithAuthor[];
  readingHistory: Array<PostWithAuthor & { readAt?: Date }>;
  userPosts: PostWithAuthor[];
}

interface FollowingData {
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
  followers: Array<{
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
}

export default function LibraryPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab') as TabType;
      return tab && ['bookmarks', 'history', 'following', 'saved', 'my-posts'].includes(tab) ? tab : 'bookmarks';
    }
    return 'bookmarks';
  });
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<LibraryData>({
    bookmarks: [],
    readingHistory: [],
    userPosts: [],
  });
  const [followingData, setFollowingData] = useState<FollowingData>({
    following: [],
    followers: [],
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/auth/signin');
    }
    if (status === 'authenticated') {
      fetchLibraryData();
    }
  }, [status]);

  const fetchLibraryData = async () => {
    try {
      setLoading(true);
      const [libraryResponse, followingResponse] = await Promise.all([
        axios.get('/api/library'),
        axios.get('/api/users/following'),
      ]);
      setData(libraryResponse.data);
      setFollowingData(followingResponse.data);
    } catch (error) {
      console.error('Error fetching library data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  const tabs = [
    { id: 'bookmarks' as TabType, label: 'Bookmarks', icon: Bookmark, count: data.bookmarks.length },
    { id: 'history' as TabType, label: 'Reading History', icon: History, count: data.readingHistory.length },
    { id: 'following' as TabType, label: 'Following', icon: UserPlus, count: followingData.following.length },
    { id: 'saved' as TabType, label: 'Saved', icon: BookOpen, count: data.bookmarks.length },
    { id: 'my-posts' as TabType, label: 'My Posts', icon: FileText, count: data.userPosts.length },
  ];

  const getCurrentPosts = () => {
    switch (activeTab) {
      case 'bookmarks':
        return data.bookmarks;
      case 'history':
        return data.readingHistory;
      case 'saved':
        return data.bookmarks; // Same as bookmarks for now
      case 'my-posts':
        return data.userPosts;
      default:
        return [];
    }
  };

  const currentPosts = getCurrentPosts();
  const activeTabData = tabs.find((t) => t.id === activeTab);

  return (
    <div className="min-h-screen py-8 bg-gray-50 dark:bg-gray-900">
      <div className="container max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
            My Library
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your bookmarks, reading history, and posts
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 mb-8 overflow-hidden">
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
                  {tab.count > 0 && (
                    <span className={`
                      px-2 py-0.5 rounded-full text-xs font-medium
                      ${isActive
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }
                    `}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'following' ? (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserPlus className="h-5 w-5 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Writers You Follow
                </h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ({followingData.following.length} {followingData.following.length === 1 ? 'writer' : 'writers'})
                </span>
              </div>
            </div>
            {followingData.following.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {followingData.following.map((user) => (
                  <div key={user.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-shadow">
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
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>{user._count.followers} followers</span>
                      </div>
                      <FollowButton userId={user.id} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center">
                <UserPlus className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  Not following anyone yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Start following writers to see their latest posts
                </p>
                <Button variant="outline" asChild>
                  <Link href="/explore">Explore Writers</Link>
                </Button>
              </div>
            )}
          </div>
        ) : currentPosts.length > 0 ? (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {activeTabData && (
                  <>
                    <activeTabData.icon className="h-5 w-5 text-primary-600" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {activeTabData.label}
                    </h2>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ({currentPosts.length} {currentPosts.length === 1 ? 'item' : 'items'})
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentPosts.map((post) => (
                <PostCard key={post.id} post={post} compact />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center">
            {activeTabData && (
              <>
                <activeTabData.icon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  No {activeTabData.label.toLowerCase()} yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {activeTab === 'bookmarks' && 'Start bookmarking posts to save them for later'}
                  {activeTab === 'history' && 'Your reading history will appear here'}
                  {activeTab === 'saved' && 'Posts you save will appear here'}
                  {activeTab === 'my-posts' && "You haven't created any posts yet"}
                </p>
                {activeTab === 'my-posts' && (
                  <Button asChild>
                    <Link href="/write">Write Your First Post</Link>
                  </Button>
                )}
                {activeTab === 'bookmarks' && (
                  <Button variant="outline" asChild>
                    <Link href="/explore">Explore Stories</Link>
                  </Button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

