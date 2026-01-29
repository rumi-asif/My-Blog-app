'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Loader2, Save, Eye, Calendar, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { RichTextEditor } from '@/components/editor/rich-text-editor';
import { ImageUpload } from '@/components/upload/image-upload';
import toast from 'react-hot-toast';
import axios from 'axios';
import { generateSlug, calculateReadTime } from '@/lib/utils';

export default function WritePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    coverImage: '',
    category: '',
    tags: [] as string[],
    status: 'DRAFT' as 'DRAFT' | 'PUBLISHED' | 'SCHEDULED',
    scheduledFor: '',
  });
  const [tagInput, setTagInput] = useState('');

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!session || (session.user.role !== 'WRITER' && session.user.role !== 'ADMIN')) {
    router.push('/auth/signin');
    return null;
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  const handleSave = async (status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED') => {
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!formData.content.trim()) {
      toast.error('Please write some content');
      return;
    }

    if (status === 'SCHEDULED' && !formData.scheduledFor) {
      toast.error('Please select a scheduled date');
      return;
    }

    setLoading(true);

    try {
      const slug = generateSlug(formData.title);
      const readTime = calculateReadTime(formData.content);

      const response = await axios.post('/api/posts', {
        ...formData,
        slug,
        readTime,
        status,
        scheduledFor: formData.scheduledFor ? new Date(formData.scheduledFor) : null,
      });

      toast.success(
        status === 'PUBLISHED'
          ? 'Post published successfully!'
          : status === 'SCHEDULED'
          ? 'Post scheduled successfully!'
          : 'Draft saved successfully!'
      );

      router.push(`/post/${response.data.post.slug}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Create New Post</h1>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => handleSave('DRAFT')}
              disabled={loading}
            >
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            <Button onClick={() => handleSave('PUBLISHED')} disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Eye className="mr-2 h-4 w-4" />
              )}
              Publish
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <Input
              placeholder="Enter your post title..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="text-3xl font-bold h-auto py-4 border-0 border-b rounded-none focus:ring-0 focus:border-primary-600"
            />
          </div>

          {/* Cover Image */}
          <Card className="p-4">
            <label className="block text-sm font-medium mb-2">
              Cover Image
            </label>
            <div className="flex space-x-2 mb-2">
              <Input
                placeholder="https://example.com/image.jpg or upload"
                value={formData.coverImage}
                onChange={(e) =>
                  setFormData({ ...formData, coverImage: e.target.value })
                }
              />
            </div>
            <ImageUpload
              value={formData.coverImage}
              onChange={(url) => setFormData({ ...formData, coverImage: url })}
            />
          </Card>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Excerpt (Optional)
            </label>
            <Textarea
              placeholder="Write a short description of your post..."
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              rows={3}
            />
          </div>

          {/* Rich Text Editor */}
          <div>
            <label className="block text-sm font-medium mb-2">Content</label>
            <RichTextEditor
              content={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Category (Optional)
            </label>
            <Input
              placeholder="e.g., Technology, Lifestyle, Business"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <div className="flex space-x-2 mb-2">
              <Input
                placeholder="Add a tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button type="button" onClick={handleAddTag} variant="outline">
                Add
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Schedule */}
          <Card className="p-4">
            <label className="block text-sm font-medium mb-2">
              <Calendar className="inline h-4 w-4 mr-2" />
              Schedule for Later (Optional)
            </label>
            <Input
              type="datetime-local"
              value={formData.scheduledFor}
              onChange={(e) =>
                setFormData({ ...formData, scheduledFor: e.target.value })
              }
            />
            {formData.scheduledFor && (
              <div className="mt-4">
                <Button
                  onClick={() => handleSave('SCHEDULED')}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Calendar className="mr-2 h-4 w-4" />
                  )}
                  Schedule Post
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

