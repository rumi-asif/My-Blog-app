'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface NotificationsClientProps {
  unreadCount: number;
}

export function NotificationsClient({ unreadCount }: NotificationsClientProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleMarkAllAsRead = async () => {
    setLoading(true);
    try {
      await axios.post('/api/notifications/mark-all-read');
      toast.success('All notifications marked as read');
      router.refresh();
    } catch (error) {
      toast.error('Failed to mark notifications as read');
    } finally {
      setLoading(false);
    }
  };

  if (unreadCount === 0) {
    return null;
  }

  return (
    <Button variant="outline" onClick={handleMarkAllAsRead} disabled={loading}>
      <Check className="mr-2 h-4 w-4" />
      Mark All as Read
    </Button>
  );
}

