'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  PenSquare,
  BookOpen,
  Search,
  Menu,
  X,
  User,
  Settings,
  LogOut,
  Bell,
  Bookmark,
  TrendingUp,
} from 'lucide-react';
import { Button } from './ui/button';
import { ThemeToggle } from './theme-toggle';
import { Avatar } from './ui/avatar';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);

  const navLinks = [
    { href: '/', label: 'Home', icon: BookOpen },
    { href: '/explore', label: 'Explore', icon: Search },
    { href: '/trending', label: 'Trending', icon: TrendingUp },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-lg dark:border-gray-800 dark:bg-gray-900/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500">
              <PenSquare className="h-6 w-6 text-white" />
            </div>
            <span className="hidden font-bold text-xl sm:inline-block">
              NextGen Blog
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary-600',
                    pathname === link.href
                      ? 'text-primary-600'
                      : 'text-gray-700 dark:text-gray-300'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />

            {session ? (
              <>
                {/* Notifications */}
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/notifications">
                    <Bell className="h-5 w-5" />
                  </Link>
                </Button>

                {/* Write button */}
                {(session.user.role === 'WRITER' || session.user.role === 'ADMIN') && (
                  <Button variant="default" size="sm" asChild className="hidden sm:flex">
                    <Link href="/write">
                      <PenSquare className="h-4 w-4 mr-2" />
                      Write
                    </Link>
                  </Button>
                )}

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2"
                  >
                    <Avatar
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      fallback={session.user.name?.charAt(0) || 'U'}
                    />
                  </button>

                  {userMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900 z-20">
                        <div className="p-3 border-b border-gray-200 dark:border-gray-800">
                          <p className="font-medium">{session.user.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {session.user.email}
                          </p>
                        </div>
                        <div className="p-2">
                          <Link
                            href="/dashboard"
                            className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <User className="h-4 w-4" />
                            <span>Dashboard</span>
                          </Link>
                          <Link
                            href="/library"
                            className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <BookOpen className="h-4 w-4" />
                            <span>Library</span>
                          </Link>
                          <Link
                            href="/settings"
                            className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Settings className="h-4 w-4" />
                            <span>Settings</span>
                          </Link>
                          <button
                            onClick={() => signOut()}
                            className="flex w-full items-center space-x-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <LogOut className="h-4 w-4" />
                            <span>Sign out</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth/signin">Sign in</Link>
                </Button>
                <Button variant="default" size="sm" asChild className="hidden sm:flex">
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800 py-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center space-x-3 px-4 py-3 text-sm font-medium',
                    pathname === link.href
                      ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20'
                      : 'text-gray-700 dark:text-gray-300'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}

