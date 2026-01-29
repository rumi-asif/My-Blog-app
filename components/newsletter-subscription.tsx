'use client';

import { useState } from 'react';
import { Mail, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import toast from 'react-hot-toast';
import axios from 'axios';

export function NewsletterSubscription() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      await axios.post('/api/subscribe', { email });
      toast.success('Successfully subscribed to our newsletter!');
      setEmail('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to subscribe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-600 py-16 md:py-24">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="container relative max-w-4xl mx-auto">
        <div className="text-center text-white mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-6">
            <Mail className="h-8 w-8" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Stay In The Loop
          </h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Get the latest stories, insights, and updates delivered directly to your inbox. 
            Join thousands of readers who never miss a post.
          </p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/20">
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/70" />
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="pl-12 h-14 bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30 focus:border-white/50 rounded-xl"
              />
            </div>
            <Button
              type="submit"
              variant="secondary"
              disabled={loading}
              size="lg"
              className="h-14 px-8 whitespace-nowrap shadow-lg hover:shadow-xl transition-shadow"
            >
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Mail className="mr-2 h-5 w-5" />
              )}
              Subscribe Now
            </Button>
          </form>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-300"></div>
              <span>No spam, ever</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-300"></div>
              <span>Unsubscribe anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-300"></div>
              <span>Free forever</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

