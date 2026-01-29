import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Bell } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';
import { NotificationsClient } from './notifications-client';

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <Bell className="mr-3 h-8 w-8" />
              Notifications
            </h1>
            {unreadCount > 0 && (
              <p className="text-gray-600 dark:text-gray-400">
                You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          <NotificationsClient unreadCount={unreadCount} />
        </div>

        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`p-4 hover:shadow-lg transition-shadow ${
                  !notification.read ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' : ''
                }`}
              >
                <Link
                  href={notification.link || '#'}
                  className="flex items-start space-x-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium">{notification.title}</h3>
                      {!notification.read && (
                        <div className="h-2 w-2 rounded-full bg-primary-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatRelativeTime(notification.createdAt)}
                    </p>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Bell className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No notifications</h2>
            <p className="text-gray-600 dark:text-gray-400">
              When you get notifications, they'll show up here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
