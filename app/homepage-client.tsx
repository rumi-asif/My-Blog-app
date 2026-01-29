'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { ArrowRight, TrendingUp, Users, Zap, Globe, Sparkles, BookOpen, PenTool, Eye, Hash, Mail, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PostCard } from '@/components/post-card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import toast from 'react-hot-toast';
import type { PostWithAuthor } from '@/types';

interface HomePageData {
  featuredPosts: PostWithAuthor[];
  trendingPosts: PostWithAuthor[];
  recentPosts: PostWithAuthor[];
  personalizedPosts?: PostWithAuthor[];
  trendingTags?: Array<{
    id: string;
    name: string;
    slug: string;
    _count: {
      posts: number;
    };
    featuredPost?: {
      id: string;
      title: string;
      slug: string;
      coverImage: string | null;
      excerpt: string | null;
    };
  }>;
  stats?: {
    totalPosts: number;
    totalWriters: number;
    totalReaders: number;
  };
}

export function HomePageClient() {
  const { data: session } = useSession();
  const [data, setData] = useState<HomePageData | null>(null);
  const [trendingHeroPost, setTrendingHeroPost] = useState<PostWithAuthor | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'forYou' | 'trending' | 'latest'>('forYou');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  useEffect(() => {
    fetchHomeData();
    fetchTrendingHeroPost();
  }, []);

  const fetchHomeData = async () => {
    try {
      const response = await fetch('/api/home');
      const homeData = await response.json();
      setData(homeData);
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrendingHeroPost = async () => {
    try {
      const response = await fetch('/api/trending/hero');
      if (response.ok) {
        const trendingPost = await response.json();
        setTrendingHeroPost(trendingPost);
      }
    } catch (error) {
      console.error('Error fetching trending hero post:', error);
    }
  };

  const handleNewsletterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setNewsletterLoading(true);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newsletterEmail }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Successfully subscribed! Check your email for confirmation.');
        setNewsletterEmail('');
      } else {
        toast.error(result.message || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast.error('Something went wrong. Please try again later.');
    } finally {
      setNewsletterLoading(false);
    }
  };

  if (loading) {
    return <HomePageSkeleton />;
  }

  if (!data) {
    return <div>Error loading content</div>;
  }

  const heroPost = data.featuredPosts[0];
  const secondaryFeatured = data.featuredPosts.slice(1, 3);

  // Determine which posts to show based on active tab
  const getTabContent = () => {
    switch (activeTab) {
      case 'forYou':
        return session ? (data.personalizedPosts || data.recentPosts) : data.recentPosts;
      case 'trending':
        return data.trendingPosts;
      case 'latest':
        return data.recentPosts;
      default:
        return data.recentPosts;
    }
  };

  const tabContent = getTabContent();

  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section with Background */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 border-b border-gray-200 dark:border-gray-800">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200/20 dark:bg-primary-700/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-200/20 dark:bg-secondary-700/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container relative py-24 md:py-32">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              {/* Hero Content */}
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium animate-fade-in">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                  </span>
                  Join {data.stats?.totalWriters.toLocaleString() || '10,000'}+ writers sharing stories
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight animate-slide-up">
                  <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                    Discover Stories
                  </span>
                  <br />
                  <span className="text-gray-900 dark:text-white">
                    That Matter
                  </span>
                </h1>
                
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-xl animate-slide-up animation-delay-200">
                  A next-generation platform where writers share their unique voices and readers discover amazing content
                </p>
                
                {/* Platform Stats */}
                <div className="flex gap-6 text-sm animate-fade-in animation-delay-400">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary-600" />
                    <span className="font-semibold">{data.stats?.totalPosts.toLocaleString() || '50K'}+</span>
                    <span className="text-gray-600 dark:text-gray-400">Stories</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary-600" />
                    <span className="font-semibold">{data.stats?.totalReaders.toLocaleString() || '100K'}+</span>
                    <span className="text-gray-600 dark:text-gray-400">Readers</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 pt-4 animate-slide-up animation-delay-600">
                  <Button size="lg" className="shadow-lg hover:shadow-xl transition-all hover:scale-105" asChild>
                    <Link href="/auth/signup">
                      Start Writing
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="hover:scale-105 transition-all" asChild>
                    <Link href="/explore">
                      Explore Stories
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Hero Trending Blog Card */}
              <div className="relative hidden md:block animate-fade-in animation-delay-800 h-full">
                {trendingHeroPost ? (
                  <div className="relative w-full h-full space-y-4">
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-lg">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-300">
                          Community Spotlight
                        </p>
                        <p className="text-sm leading-snug text-gray-600 dark:text-gray-400">
                          This story leads the week with the most reads, saves, and conversations.
                        </p>
                      </div>
                    </div>
                    <div className="relative w-full h-full">
                      <PostCard post={trendingHeroPost} hero />
                    </div>
                  </div>
                ) : (
                  <div className="relative h-[500px] w-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-3xl"></div>
                    <div className="absolute inset-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-red-500"></div>
                          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                          <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        </div>
                        <div className="space-y-3">
                          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-3/4 animate-pulse"></div>
                          <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-full animate-pulse delay-100"></div>
                          <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-5/6 animate-pulse delay-200"></div>
                        </div>
                        <div className="pt-4 space-y-2">
                          <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-full animate-pulse delay-300"></div>
                          <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-4/5 animate-pulse delay-400"></div>
                          <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-5/6 animate-pulse delay-500"></div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute -bottom-4 -right-4 bg-primary-500 text-white p-4 rounded-2xl shadow-xl animate-bounce">
                      <PenTool className="h-6 w-6" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Hero Post */}
      {heroPost && (
        <section className="py-16 bg-white dark:bg-gray-950">
          <div className="container">
            <div className="flex items-center gap-2 mb-8 animate-fade-in">
              <div className="h-1 w-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full"></div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100">
                Featured Story
              </h2>
            </div>
            <PostCard post={heroPost} featured />
          </div>
        </section>
      )}

      {/* Main Content Area with Sidebar */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900/30">
        <div className="container">
          <div className="grid lg:grid-cols-[1fr_340px] gap-8">
            {/* Main Content */}
            <div>
              {/* Content Tabs */}
              <div className="mb-8">
                <div className="flex items-center gap-1 p-1 bg-white dark:bg-gray-900 rounded-xl shadow-sm w-fit">
                  <button
                    onClick={() => setActiveTab('forYou')}
                    className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                      activeTab === 'forYou'
                        ? 'bg-primary-500 text-white shadow-md'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <Sparkles className="h-4 w-4 inline-block mr-2" />
                    For You
                  </button>
                  <button
                    onClick={() => setActiveTab('trending')}
                    className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                      activeTab === 'trending'
                        ? 'bg-primary-500 text-white shadow-md'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <TrendingUp className="h-4 w-4 inline-block mr-2" />
                    Trending
                  </button>
                  <button
                    onClick={() => setActiveTab('latest')}
                    className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                      activeTab === 'latest'
                        ? 'bg-primary-500 text-white shadow-md'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <Zap className="h-4 w-4 inline-block mr-2" />
                    Latest
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="grid md:grid-cols-2 gap-6">
                {tabContent.length > 0 ? (
                  tabContent.slice(0, 6).map((post, index) => (
                    <div
                      key={post.id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <PostCard post={post} />
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400">No posts available</p>
                  </div>
                )}
              </div>

              {/* Load More */}
              {tabContent.length > 6 && (
                <div className="mt-8 text-center">
                  <Button variant="outline" size="lg">
                    Load More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-8">
              {/* Trending Topics*/}
              {data.trendingTags && data.trendingTags.length > 0 && (
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm">
                  <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary-600" />
                    Trending Topics
                  </h3>
                  <div className="space-y-3">
                    {data.trendingTags.slice(0, 4).map((tag, index) => {
                      // Generate a color based on index for visual variety
                      const colors = [
                        { bg: 'bg-blue-50 dark:bg-blue-950/30', text: 'text-blue-700 dark:text-blue-300', accent: 'bg-blue-600', pattern: 'from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40' },
                        { bg: 'bg-purple-50 dark:bg-purple-950/30', text: 'text-purple-700 dark:text-purple-300', accent: 'bg-purple-600', pattern: 'from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40' },
                        { bg: 'bg-pink-50 dark:bg-pink-950/30', text: 'text-pink-700 dark:text-pink-300', accent: 'bg-pink-600', pattern: 'from-pink-100 to-pink-200 dark:from-pink-900/40 dark:to-pink-800/40' },
                        { bg: 'bg-green-50 dark:bg-green-950/30', text: 'text-green-700 dark:text-green-300', accent: 'bg-green-600', pattern: 'from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40' },
                        { bg: 'bg-orange-50 dark:bg-orange-950/30', text: 'text-orange-700 dark:text-orange-300', accent: 'bg-orange-600', pattern: 'from-orange-100 to-orange-200 dark:from-orange-900/40 dark:to-orange-800/40' },
                        { bg: 'bg-indigo-50 dark:bg-indigo-950/30', text: 'text-indigo-700 dark:text-indigo-300', accent: 'bg-indigo-600', pattern: 'from-indigo-100 to-indigo-200 dark:from-indigo-900/40 dark:to-indigo-800/40' },
                        { bg: 'bg-teal-50 dark:bg-teal-950/30', text: 'text-teal-700 dark:text-teal-300', accent: 'bg-teal-600', pattern: 'from-teal-100 to-teal-200 dark:from-teal-900/40 dark:to-teal-800/40' },
                      ];
                      const colorScheme = colors[index % colors.length];
                      
                      const hasImage = tag.featuredPost?.coverImage;
                      const linkHref = tag.featuredPost ? `/post/${tag.featuredPost.slug}` : `/explore?tag=${tag.slug}`;
                      
                      return (
                        <Link
                          key={tag.id}
                          href={linkHref}
                          className="block group"
                        >
                          <div className="flex items-stretch gap-0 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 group-hover:border-primary-300 dark:group-hover:border-primary-700">
                            {/* Left Thumbnail Section - Square */}
                            <div className={`relative flex-shrink-0 w-28 h-28 ${!hasImage ? colorScheme.bg + ' bg-gradient-to-br ' + colorScheme.pattern : ''} flex flex-col items-center justify-center overflow-hidden`}>
                              {hasImage ? (
                                <>
                                  <Image
                                    src={tag.featuredPost!.coverImage!}
                                    alt={tag.featuredPost!.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                  />
                                </>
                              ) : (
                                <>
                                  {/* Pattern/Visual Background - Similar to image */}
                                  <div className="absolute inset-0 opacity-20">
                                    {/* Top pattern elements */}
                                    <div className="absolute top-2 left-2 w-6 h-6 border-2 border-current rounded"></div>
                                    <div className="absolute top-2 right-2 w-4 h-4 border-2 border-current rounded-full"></div>
                                    {/* Middle pattern elements */}
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 border-2 border-current rotate-45"></div>
                                    <div className="absolute top-1/2 left-2 w-2 h-2 border border-current rounded-full"></div>
                                    <div className="absolute top-1/2 right-2 w-2 h-2 border border-current"></div>
                                    {/* Bottom pattern elements */}
                                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-5 h-5 border-2 border-current rounded-full"></div>
                                    <div className="absolute bottom-2 right-2 w-3 h-3 border border-current rotate-45"></div>
                                  </div>
                                  {/* Icon */}
                                  <Hash className={`h-6 w-6 ${colorScheme.text} relative z-10 mb-1`} />
                                  {/* Small title text like in image */}
                                  <span className={`text-[10px] font-semibold ${colorScheme.text} relative z-10 uppercase tracking-wide`}>
                                    Topic
                                  </span>
                                </>
                              )}
                            </div>
                            
                            {/* Right Content Section */}
                            <div className="flex-1 min-w-0 p-4 flex flex-col justify-between">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge className={`text-[10px] font-bold px-2 py-0.5 ${colorScheme.accent} text-white border-0 uppercase tracking-wide`}>
                                    Trending
                                  </Badge>
                                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                    <Eye className="h-3 w-3" />
                                    <span>{tag._count.posts} posts</span>
                                  </div>
                                </div>
                                <h4 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-tight mb-2">
                                  {tag.name}
                                </h4>
                                {tag.featuredPost?.excerpt && (
                                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-snug">
                                    {tag.featuredPost.excerpt}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Newsletter Signup */}
              <div className="bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl p-6 text-white">
                <h3 className="font-semibold text-lg mb-2">Stay Updated</h3>
                <p className="text-sm opacity-90 mb-4">
                  Get the best stories delivered to your inbox weekly
                </p>
                <form onSubmit={handleNewsletterSubscribe} className="space-y-3">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/70" />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      disabled={newsletterLoading}
                      className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/20 backdrop-blur placeholder:text-white/70 text-white border border-white/20 focus:border-white/40 focus:outline-none disabled:opacity-50"
                      required
                    />
                  </div>
                  <Button 
                    type="submit"
                    disabled={newsletterLoading}
                    className="w-full bg-white text-primary-600 hover:bg-white/90 disabled:opacity-50"
                  >
                    {newsletterLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Subscribing...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Subscribe
                      </>
                    )}
                  </Button>
                </form>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="flex items-center gap-2 text-xs text-white/80">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-300"></div>
                    <span>No spam, unsubscribe anytime</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-4">Platform Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Stories Published</span>
                    <span className="font-semibold">{data.stats?.totalPosts.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Active Writers</span>
                    <span className="font-semibold">{data.stats?.totalWriters.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Community Members</span>
                    <span className="font-semibold">{data.stats?.totalReaders.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Secondary Featured Grid */}
      {secondaryFeatured.length > 0 && (
        <section className="py-12 bg-white dark:bg-gray-950">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">More Featured Stories</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/explore?featured=true">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {secondaryFeatured.map((post) => (
                <PostCard key={post.id} post={post} compact />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h3 className="text-3xl md:text-4xl font-bold">Ready to Start Writing?</h3>
            <p className="text-lg opacity-90">
              Join thousands of writers sharing their stories with the world
            </p>
            <Button size="lg" variant="secondary" className="shadow-xl hover:scale-105 transition-transform" asChild>
              <Link href="/auth/signup">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function HomePageSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Hero Skeleton */}
      <section className="py-24 md:py-32 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <div className="container">
          <div className="max-w-5xl mx-auto space-y-8">
            <Skeleton className="h-12 w-48" />
            <Skeleton className="h-20 w-3/4" />
            <Skeleton className="h-6 w-2/3" />
            <div className="flex gap-4">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 w-32" />
            </div>
          </div>
        </div>
      </section>

      {/* Content Skeleton */}
      <section className="py-12">
        <div className="container">
          <div className="grid lg:grid-cols-[1fr_340px] gap-8">
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
            <div className="space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
