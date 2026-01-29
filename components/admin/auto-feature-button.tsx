'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

export function AutoFeatureButton() {
  const [loading, setLoading] = useState(false);

  const handleAutoFeature = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/admin/auto-feature');
      const { featured, unfeatured, message } = response.data;
      toast.success(message || `Auto-featured ${featured} posts and unfeatured ${unfeatured} old posts`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to run auto-feature');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleAutoFeature}
      disabled={loading}
      variant="outline"
      className="w-full"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Run Auto-Feature
        </>
      )}
    </Button>
  );
}

