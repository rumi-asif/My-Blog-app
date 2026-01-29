'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { MessageCircle, Send, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';
import { formatRelativeTime } from '@/lib/utils';
import toast from 'react-hot-toast';
import axios from 'axios';
import Link from 'next/link';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
  replies?: Comment[];
}

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/posts/${postId}/comments`);
      setComments(data.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      toast.error('Please sign in to comment');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`/api/posts/${postId}/comments`, {
        content: newComment,
        parentId: replyTo,
      });

      setNewComment('');
      setReplyTo(null);
      await fetchComments();
      toast.success('Comment posted!');
    } catch (error) {
      toast.error('Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await axios.delete(`/api/comments/${commentId}`);
      toast.success('Comment deleted');
      fetchComments();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete comment');
    }
  };

  const renderComment = (comment: Comment, depth = 0) => {
    const isAdmin = session?.user?.role === 'ADMIN';
    const isOwner = session?.user?.id === comment.author.id;
    const canDelete = isAdmin || isOwner;

    return (
      <div key={comment.id} className={depth > 0 ? 'ml-8' : ''}>
        <div className="flex space-x-3 mb-4">
          <Avatar
            src={comment.author.image}
            alt={comment.author.name || 'User'}
            fallback={comment.author.name?.charAt(0) || 'U'}
            className="h-8 w-8"
          />
          <div className="flex-1">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 relative group">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/author/${comment.author.id}`}
                    className="font-medium text-sm hover:text-primary-600"
                  >
                    {comment.author.name}
                  </Link>
                  <span className="text-xs text-gray-500">
                    {formatRelativeTime(comment.createdAt)}
                  </span>
                </div>
                {canDelete && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                    title="Delete comment"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                {comment.content}
              </p>
            </div>
            <button
              onClick={() => setReplyTo(comment.id)}
              className="text-xs text-gray-500 hover:text-primary-600 mt-2"
            >
              Reply
            </button>
          </div>
        </div>

        {(comment.replies || []).map((reply) => renderComment(reply, depth + 1))}

        {replyTo === comment.id && (
        <div className="ml-11 mb-4">
          <form onSubmit={handleSubmit} className="space-y-2">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a reply..."
              rows={2}
            />
            <div className="flex space-x-2">
              <Button type="submit" size="sm" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                Reply
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  setReplyTo(null);
                  setNewComment('');
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}
      </div>
    );
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <MessageCircle className="h-6 w-6 mr-2" />
        Comments ({comments.length})
      </h2>

      {/* Comment Form */}
      {session ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex space-x-3">
            <Avatar
              src={session.user.image}
              alt={session.user.name || 'You'}
              fallback={session.user.name?.charAt(0) || 'U'}
              className="h-10 w-10"
            />
            <div className="flex-1">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                rows={3}
              />
              <Button
                type="submit"
                className="mt-2"
                disabled={submitting || !newComment.trim()}
              >
                {submitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Post Comment
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Please sign in to leave a comment
          </p>
          <Button variant="outline" size="sm" asChild>
            <Link href="/auth/signin">Sign In</Link>
          </Button>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => renderComment(comment))}
        </div>
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-400 py-8">
          No comments yet. Be the first to comment!
        </p>
      )}
    </div>
  );
}

