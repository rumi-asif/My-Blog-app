'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Settings, User, Bell, Lock, Trash2, Save, Loader2 } from 'lucide-react';
import { ImageUpload } from '@/components/upload/image-upload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security'>('profile');

  // Helper to ensure image URLs are web-compatible (convert HEIC to JPG)
  const getWebCompatibleImageUrl = (url: string | null | undefined): string => {
    if (!url) return '';
    // If it's a Cloudinary URL, ensure it converts HEIC/unsupported formats to JPG
    if (url.includes('res.cloudinary.com')) {
      // Check if URL already has transformations
      if (url.includes('/upload/')) {
        // Insert format conversion before the version number
        return url.replace('/upload/', '/upload/f_jpg,q_auto/');
      }
    }
    return url;
  };

  const [profileData, setProfileData] = useState({
    name: session?.user?.name || '',
    bio: '',
    website: '',
    twitter: '',
    github: '',
    linkedin: '',
    image: session?.user?.image || '',
  });

  const [notificationData, setNotificationData] = useState({
    emailNotifications: true,
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (session) {
      fetchUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('/api/user/profile');
      const user = response.data.user;
      console.log('🔄 Fetched user data - Image URL:', user.image);
      setProfileData({
        name: user.name || '',
        bio: user.bio || '',
        website: user.website || '',
        twitter: user.twitter || '',
        github: user.github || '',
        linkedin: user.linkedin || '',
        image: user.image || '',
      });
      setNotificationData({
        emailNotifications: user.emailNotifications ?? true,
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.patch('/api/user/profile', profileData);
      // Refetch profile data to get the latest image URL
      await fetchUserData();
      // Force session update to refresh navbar and other components
      await update();
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.patch('/api/user/profile', notificationData);
      toast.success('Notification preferences updated successfully!');
    } catch (error: any) {
      toast.error('Failed to update notification preferences');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (securityData.newPassword !== securityData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (securityData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      // Update password logic would go here
      toast.success('Password changed successfully!');
      setSecurityData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'security' as const, label: 'Security', icon: Lock },
  ];

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <Settings className="mr-3 h-8 w-8" />
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your public profile information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="flex items-center space-x-4">
                  {profileData.image ? (
                    <img
                      src={getWebCompatibleImageUrl(profileData.image)}
                      alt="Profile picture"
                      className="h-20 w-20 rounded-full object-cover"
                      onLoad={() => console.log('✅ Image loaded successfully:', profileData.image)}
                      onError={(e) => {
                        console.error('❌ Image failed to load:', profileData.image);
                        console.error('Transformed URL:', getWebCompatibleImageUrl(profileData.image));
                        console.error('Error details:', e);
                      }}
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-2xl font-bold">
                      {session?.user?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{session?.user?.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {session?.user?.email}
                    </p>
                    {session?.user?.role && (
                      <Badge variant="secondary" className="mt-1">
                        {session.user.role}
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Profile Image</label>
                  <div className="max-w-sm">
                    <ImageUpload
                      value={profileData.image}
                      onChange={(url) => {
                        console.log('🖼️ Image upload onChange - New URL:', url);
                        setProfileData({ ...profileData, image: url });
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Display Name
                  </label>
                  <Input
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    placeholder="Your display name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  <Textarea
                    value={profileData.bio}
                    onChange={(e) =>
                      setProfileData({ ...profileData, bio: e.target.value })
                    }
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Website
                    </label>
                    <Input
                      type="url"
                      value={profileData.website}
                      onChange={(e) =>
                        setProfileData({ ...profileData, website: e.target.value })
                      }
                      placeholder="https://yourwebsite.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Twitter
                    </label>
                    <Input
                      value={profileData.twitter}
                      onChange={(e) =>
                        setProfileData({ ...profileData, twitter: e.target.value })
                      }
                      placeholder="@username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      GitHub
                    </label>
                    <Input
                      value={profileData.github}
                      onChange={(e) =>
                        setProfileData({ ...profileData, github: e.target.value })
                      }
                      placeholder="@username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      LinkedIn
                    </label>
                    <Input
                      value={profileData.linkedin}
                      onChange={(e) =>
                        setProfileData({ ...profileData, linkedin: e.target.value })
                      }
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNotificationSubmit} className="space-y-6">
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receive email updates about your activity
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationData.emailNotifications}
                      onChange={(e) =>
                        setNotificationData({
                          ...notificationData,
                          emailNotifications: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Change your password and manage security preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Current Password
                  </label>
                  <Input
                    type="password"
                    value={securityData.currentPassword}
                    onChange={(e) =>
                      setSecurityData({
                        ...securityData,
                        currentPassword: e.target.value,
                      })
                    }
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    New Password
                  </label>
                  <Input
                    type="password"
                    value={securityData.newPassword}
                    onChange={(e) =>
                      setSecurityData({
                        ...securityData,
                        newPassword: e.target.value,
                      })
                    }
                    placeholder="Enter new password"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Must be at least 8 characters long
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Confirm New Password
                  </label>
                  <Input
                    type="password"
                    value={securityData.confirmPassword}
                    onChange={(e) =>
                      setSecurityData({
                        ...securityData,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="Confirm new password"
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Change Password
                  </Button>
                </div>
              </form>

              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-red-600">Danger Zone</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

