'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  fallback?: string;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false);
    const initials = fallback || alt?.charAt(0).toUpperCase() || '?';

    // Helper to ensure image URLs are web-compatible (convert HEIC to JPG)
    const getWebCompatibleImageUrl = (url: string | null | undefined): string => {
      if (!url) return '';
      // If it's a Cloudinary URL, ensure it converts HEIC/unsupported formats to JPG
      if (url.includes('res.cloudinary.com')) {
        if (url.includes('/upload/')) {
          // Insert format conversion before the version number
          return url.replace('/upload/', '/upload/f_jpg,q_auto/');
        }
      }
      return url;
    };

    // Reset error state when src changes
    React.useEffect(() => {
      if (src) {
        setImageError(false);
      }
    }, [src]);

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
          className
        )}
        {...props}
      >
        {src && !imageError ? (
          <img
            src={getWebCompatibleImageUrl(src)}
            alt={alt || 'Avatar'}
            className="aspect-square h-full w-full object-cover"
            onError={() => setImageError(true)}
            key={src}
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-500 to-secondary-500 text-white font-semibold">
            {initials}
          </div>
        )}
      </div>
    );
  }
);
Avatar.displayName = 'Avatar';

export { Avatar };

