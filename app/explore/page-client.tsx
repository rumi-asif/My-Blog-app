'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { PostCard } from '@/components/post-card';
import type { PostWithAuthor } from '@/types';
import axios from 'axios';

interface ExplorePageClientProps {
  initialPosts: PostWithAuthor[];
  categories: any[];
  tags: any[];
}

export function ExplorePageClient({ initialPosts, categories, tags }: ExplorePageClientProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, selectedTag]);

  const performSearch = useCallback(async () => {
    if (!searchQuery && !selectedCategory && !selectedTag) {
      setPosts(initialPosts);
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedTag) params.append('tag', selectedTag);

      const response = await axios.get(`/api/posts?${params.toString()}`);
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedTag, initialPosts]);

  return (
    <>
      {/* Modern Compact Search Bar */}
      <div className="mb-8 max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search stories, topics, or authors..."
            className="pl-11 pr-4 h-11 text-sm border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent rounded-full bg-gray-50 dark:bg-gray-900"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {(searchQuery || selectedCategory || selectedTag) && (
            <button
              onClick={() => { 
                setSearchQuery(''); 
                setSelectedCategory(null); 
                setSelectedTag(null); 
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Modern Sidebar Filters */}
        <div className="lg:col-span-3 space-y-4">
          {/* Categories Filter */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Categories</h3>
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-xs text-primary-600 hover:text-primary-700"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(
                    selectedCategory === category.slug ? null : category.slug
                  )}
                  className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                    selectedCategory === category.slug
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 font-medium'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span>{category.name}</span>
                  <span className={`text-xs ${
                    selectedCategory === category.slug 
                      ? 'text-primary-600 dark:text-primary-400' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {category._count.posts}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Tags Filter */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Tags</h3>
              {selectedTag && (
                <button
                  onClick={() => setSelectedTag(null)}
                  className="text-xs text-primary-600 hover:text-primary-700"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 12).map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => setSelectedTag(
                    selectedTag === tag.slug ? null : tag.slug
                  )}
                  className={`px-3 py-1.5 text-xs rounded-full transition-all font-medium ${
                    selectedTag === tag.slug
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900/30'
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="lg:col-span-9">
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Searching...</p>
            </div>
          ) : posts.length > 0 ? (
            <>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Found {posts.length} {posts.length === 1 ? 'story' : 'stories'}
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} compact />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                No posts found matching your criteria
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

