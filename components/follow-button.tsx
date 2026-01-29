'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { UserPlus, UserCheck, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axios from 'axios';

interface FollowButtonProps {
  userId: string;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}

export function FollowButton({ userId, className, size = 'default' }: FollowButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (session && session.user.id !== userId) {
      checkFollowStatus();
    } else {
      setChecking(false);
    }
  }, [session, userId]);

  const checkFollowStatus = async () => {
    try {
      const { data } = await axios.get(`/api/users/${userId}/follow`);
      setFollowing(data.following);
    } catch (error) {
      console.error('Error checking follow status:', error);
    } finally {
      setChecking(false);
    }
  };

  const handleFollow = async () => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (session.user.id === userId) {
      return; // Can't follow yourself
    }

    // Check if already following before making the request
    const wasFollowing = following;

    setLoading(true);
    try {
      const { data } = await axios.post(`/api/users/${userId}/follow`);
      setFollowing(data.following);
      
      // Show different messages based on action and previous state
      if (data.following && !wasFollowing) {
        toast.success('Now following this writer!');
      } else if (!data.following && wasFollowing) {
        toast.success('Unfollowed this writer');
      } else if (data.following && wasFollowing) {
        toast('You are already following this writer');
      }
      
      // Refresh page to update follower count
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to follow/unfollow');
    } finally {
      setLoading(false);
    }
  };

  if (!session || session.user.id === userId || checking) {
    return null;
  }

  return (
    <Button
      onClick={handleFollow}
      disabled={loading}
      variant={following ? 'outline' : 'default'}
      size={size}
      className={className}
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : following ? (
        <>
          <UserCheck className="mr-2 h-4 w-4" />
          Following
        </>
      ) : (
        <>
          <UserPlus className="mr-2 h-4 w-4" />
          Follow
        </>
      )}
    </Button>
  );
}

