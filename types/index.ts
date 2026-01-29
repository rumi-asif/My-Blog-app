import { Post, User, Comment, Category, Tag, UserRole, PostStatus } from '@prisma/client';

export type { UserRole, PostStatus };

export interface PostWithAuthor extends Post {
  author: User;
  category: Category | null;
  tags: Tag[];
  _count: {
    likes: number;
    comments: number;
    bookmarks: number;
  };
}

export interface CommentWithAuthor extends Comment {
  author: User;
  replies: CommentWithAuthor[];
}

export interface UserProfile extends User {
  _count: {
    posts: number;
    comments: number;
    likes: number;
    bookmarks: number;
  };
}

export interface DashboardStats {
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
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: Date;
}

