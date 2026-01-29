'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Trash2 } from 'lucide-react';

interface CommentActionsProps {
  commentId: string;
}

export function CommentActions({ commentId }: CommentActionsProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleApprove = async () => {
    setLoading(true);
    try {
      await axios.post(`/api/comments/${commentId}/approve`);
      toast.success('Comment approved');
      router.refresh();
    } catch (error) {
      toast.error('Failed to approve comment');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      await axios.post(`/api/comments/${commentId}/reject`);
      toast.success('Comment rejected');
      router.refresh();
    } catch (error) {
      toast.error('Failed to reject comment');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`/api/comments/${commentId}`);
      toast.success('Comment deleted');
      router.refresh();
    } catch (error) {
      toast.error('Failed to delete comment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex space-x-2">
      <Button size="sm" variant="default" onClick={handleApprove} disabled={loading}>
        Approve
      </Button>
      <Button size="sm" variant="destructive" onClick={handleReject} disabled={loading}>
        Reject
      </Button>
      <Button size="sm" variant="destructive" onClick={handleDelete} disabled={loading}>
        <Trash2 className="h-4 w-4 mr-1" /> Delete
      </Button>
    </div>
  );
}

