'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, MessageCircle, Bookmark, Clock, TrendingUp, ImageIcon } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar } from './ui/avatar';
import { formatRelativeTime } from '@/lib/utils';
import type { PostWithAuthor } from '@/types';

interface PostCardProps {
  post: PostWithAuthor;
  featured?: boolean;
  compact?: boolean;
  hero?: boolean;
}

export function PostCard({ post, featured = false, compact = false, hero = false }: PostCardProps) {
  const { author, category, tags, _count } = post;

  // Hero card design - large cover image with content overlay
  if (hero) {
    return (
      <Link href={`/post/${post.slug}`} className="block group h-full">
        <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 shadow-lg group-hover:shadow-2xl h-full flex flex-col rounded-2xl">
          {post.coverImage && (
            <div className="relative h-full min-h-[500px] w-full overflow-hidden flex-shrink-0 rounded-2xl">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              
              {/* Content Overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <div className="flex items-center gap-2 mb-3">
                  {category && (
                    <Badge variant="secondary" className="text-xs font-medium bg-white/20 backdrop-blur-sm border-white/30 text-white">
                      {category.name}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs border-white/30 text-white bg-white/10 backdrop-blur-sm">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Trending
                  </Badge>
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold mb-3 line-clamp-2 group-hover:text-primary-300 transition-colors leading-tight">
                  {post.title}
                </h2>
                
                {post.excerpt && (
                  <p className="text-sm text-white/90 line-clamp-2 mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}
                
                <div className="flex items-center justify-between pt-4 border-t border-white/20">
                  <div className="flex items-center space-x-3">
                    <Avatar
                      src={author.image}
                      alt={author.name || 'Author'}
                      fallback={author.name?.charAt(0) || 'A'}
                      className="h-8 w-8 border-2 border-white/30"
                    />
                    <div>
                      <p className="text-sm font-semibold text-white">{author.name}</p>
                      <p className="text-xs text-white/70">
                        {formatRelativeTime(post.publishedAt || post.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-white/80">
                    <span className="flex items-center space-x-1">
                      <Heart className="h-4 w-4" />
                      <span>{_count.likes}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{_count.comments}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{post.readTime}m</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Fallback if no cover image */}
          {!post.coverImage && (
            <div className="p-6 flex-1 flex flex-col justify-center bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900 dark:to-secondary-900">
              <div className="flex items-center gap-2 mb-4">
                {category && (
                  <Badge variant="secondary" className="text-xs font-medium">
                    {category.name}
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs border-primary-500 text-primary-600 dark:text-primary-400">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Trending
                </Badge>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors leading-tight">
                {post.title}
              </h2>
              
              {post.excerpt && (
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
                  {post.excerpt}
                </p>
              )}
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center space-x-3">
                  <Avatar
                    src={author.image}
                    alt={author.name || 'Author'}
                    fallback={author.name?.charAt(0) || 'A'}
                    className="h-8 w-8"
                  />
                  <div>
                    <p className="text-sm font-semibold">{author.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatRelativeTime(post.publishedAt || post.createdAt)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center space-x-1">
                    <Heart className="h-4 w-4" />
                    <span>{_count.likes}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{_count.comments}</span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </Card>
      </Link>
    );
  }

  if (featured) {
    return (
      <Link href={`/post/${post.slug}`} className="block group">
        <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 shadow-lg group-hover:shadow-2xl">
          <div className="grid md:grid-cols-2 gap-0">
            {post.coverImage && (
              <div className="relative h-64 md:h-[400px] overflow-hidden">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            )}
            <div className="p-8 md:p-10 flex flex-col justify-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
              <div className="flex items-center space-x-2 mb-4">
                {category && (
                  <Badge variant="secondary" className="text-xs font-medium">
                    {category.name}
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs border-primary-500 text-primary-600 dark:text-primary-400">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-4 line-clamp-3 group-hover:text-primary-600 transition-colors leading-tight">
                {post.title}
              </h2>
              
              {post.excerpt && (
                <div className="mb-6">
                  <p className="text-gray-600 dark:text-gray-400 text-base line-clamp-3 group-hover:line-clamp-none group-hover:max-h-[120px] transition-all duration-300 ease-in-out overflow-hidden">
                    {post.excerpt}
                  </p>
                  <span className="text-primary-600 dark:text-primary-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-2 inline-block">
                    Read more →
                  </span>
                </div>
              )}
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center space-x-3">
                  <Avatar
                    src={author.image}
                    alt={author.name || 'Author'}
                    fallback={author.name?.charAt(0) || 'A'}
                    className="h-10 w-10"
                  />
                  <div>
                    <p className="text-sm font-semibold">{author.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatRelativeTime(post.publishedAt || post.createdAt)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{post.readTime}m</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Heart className="h-4 w-4" />
                    <span>{_count.likes}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  // Compact card design
  if (compact) {
    return (
      <Link href={`/post/${post.slug}`} className="block group">
        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col border-0 shadow-sm group-hover:shadow-lg">
          {post.coverImage ? (
            <div className="relative h-40 w-full overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ) : (
            <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
              <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-600">
                <ImageIcon className="h-12 w-12 mb-2" />
                <span className="text-xs font-medium">No Image</span>
              </div>
            </div>
          )}
          
          <div className="p-4 flex-1 flex flex-col">
            {category && (
              <Badge variant="secondary" className="w-fit mb-2 text-xs">
                {category.name}
              </Badge>
            )}
            
            <h3 className="text-base font-semibold mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
              {post.title}
            </h3>
            
            {post.excerpt && (
              <div className="mb-3 flex-1">
                <p className="text-gray-600 dark:text-gray-400 text-xs line-clamp-2 group-hover:line-clamp-none group-hover:max-h-[80px] transition-all duration-300 ease-in-out overflow-hidden">
                  {post.excerpt}
                </p>
                <span className="text-primary-600 dark:text-primary-400 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1 inline-block">
                  More →
                </span>
              </div>
            )}
            
            <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800 mt-auto">
              <div className="flex items-center space-x-2">
                <Avatar
                  src={author.image}
                  alt={author.name || 'Author'}
                  fallback={author.name?.charAt(0) || 'A'}
                  className="h-5 w-5"
                />
                <span className="text-xs font-medium">{author.name}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span className="flex items-center space-x-1">
                  <Heart className="h-3 w-3" />
                  <span>{_count.likes}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{post.readTime}m</span>
                </span>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/post/${post.slug}`} className="block group">
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col border-0 shadow-md group-hover:shadow-2xl">
        {post.coverImage ? (
          <div className="relative h-40 w-full overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ) : (
          <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-600">
              <ImageIcon className="h-12 w-12 mb-2" />
              <span className="text-xs font-medium">No Image</span>
            </div>
          </div>
        )}
        
        <div className="p-4 flex-1 flex flex-col">
          {category && (
            <Badge variant="secondary" className="w-fit mb-2 text-xs">
              {category.name}
            </Badge>
          )}
          
          <h3 className="text-base font-bold mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors leading-tight">
            {post.title}
          </h3>
          
          {post.excerpt && (
            <div className="mb-3 flex-1">
              <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 group-hover:line-clamp-none group-hover:max-h-[80px] transition-all duration-300 ease-in-out overflow-hidden">
                {post.excerpt}
              </p>
              <span className="text-primary-600 dark:text-primary-400 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1 inline-block">
                Read more →
              </span>
            </div>
          )}
          
          {tags.length > 0 && !compact && (
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.slice(0, 2).map((tag) => (
                <Badge key={tag.id} variant="outline" className="text-xs">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
          
          <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-800 mt-auto">
            <div className="flex items-center space-x-2">
              <Avatar
                src={author.image}
                alt={author.name || 'Author'}
                fallback={author.name?.charAt(0) || 'A'}
                className="h-5 w-5"
              />
              <span className="text-xs font-medium">{author.name}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
              <span className="flex items-center space-x-1">
                <Heart className="h-3 w-3" />
                <span>{_count.likes}</span>
              </span>
              <span className="flex items-center space-x-1">
                <MessageCircle className="h-3 w-3" />
                <span>{_count.comments}</span>
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

