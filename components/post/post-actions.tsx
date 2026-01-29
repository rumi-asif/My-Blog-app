'use client';

import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axios from 'axios';

interface PostActionsProps {
  postId: string;
  userId?: string;
}

export function PostActions({ postId, userId }: PostActionsProps) {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchStatus();
    }
  }, [postId, userId]);

  const fetchStatus = async () => {
    try {
      const { data } = await axios.get(`/api/posts/${postId}/status`);
      setLiked(data.liked);
      setBookmarked(data.bookmarked);
      setLikesCount(data.likesCount);
    } catch (error) {
      console.error('Error fetching status:', error);
    }
  };

  const handleLike = async () => {
    if (!userId) {
      router.push('/auth/signin');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(`/api/posts/${postId}/like`);
      setLiked(data.liked);
      setLikesCount(data.likesCount);
      toast.success(data.liked ? 'Post liked!' : 'Like removed');
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async () => {
    if (!userId) {
      router.push('/auth/signin');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(`/api/posts/${postId}/bookmark`);
      setBookmarked(data.bookmarked);
      toast.success(data.bookmarked ? 'Post bookmarked!' : 'Bookmark removed');
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={liked ? 'default' : 'outline'}
        size="sm"
        onClick={handleLike}
        disabled={loading}
      >
        <Heart className={`h-4 w-4 mr-2 ${liked ? 'fill-current' : ''}`} />
        {likesCount}
      </Button>
      <Button
        variant={bookmarked ? 'default' : 'outline'}
        size="sm"
        onClick={handleBookmark}
        disabled={loading}
      >
        <Bookmark className={`h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} />
      </Button>
    </div>
  );
}

