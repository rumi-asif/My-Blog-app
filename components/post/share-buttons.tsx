'use client';

import { Share2, Twitter, Facebook, Linkedin, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import {
  TwitterShareButton,
  FacebookShareButton,
  LinkedinShareButton,
} from 'react-share';

interface ShareButtonsProps {
  url: string;
  title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">
        <Share2 className="h-4 w-4 inline mr-1" />
        Share:
      </span>

      <TwitterShareButton url={url} title={title}>
        <Button variant="ghost" size="icon">
          <Twitter className="h-4 w-4" />
        </Button>
      </TwitterShareButton>

      <FacebookShareButton url={url}>
        <Button variant="ghost" size="icon">
          <Facebook className="h-4 w-4" />
        </Button>
      </FacebookShareButton>

      <LinkedinShareButton url={url} title={title}>
        <Button variant="ghost" size="icon">
          <Linkedin className="h-4 w-4" />
        </Button>
      </LinkedinShareButton>

      <Button variant="ghost" size="icon" onClick={handleCopyLink}>
        <LinkIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}

