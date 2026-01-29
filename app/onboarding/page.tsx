'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Check, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import toast from 'react-hot-toast';
import axios from 'axios';

const INTERESTS = [
  'Technology',
  'Business',
  'Lifestyle',
  'Travel',
  'Food',
  'Health',
  'Science',
  'Art',
  'Music',
  'Sports',
  'Fashion',
  'Entertainment',
];

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    role: 'READER' as 'READER' | 'WRITER',
    bio: '',
    website: '',
    interests: [] as string[],
  });

  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  const handleRoleSelection = (role: 'READER' | 'WRITER') => {
    setFormData({ ...formData, role });
    setStep(2);
  };

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      await axios.post('/api/user/onboarding', formData);
      await update();
      toast.success('Welcome to NextGen Blog!');
      router.push(formData.role === 'WRITER' ? '/dashboard' : '/explore');
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  s <= step
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-500'
                }`}
              >
                {s < step ? <Check className="h-5 w-5" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`w-20 h-1 mx-2 ${
                    s < step ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-800'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <Card className="p-8">
          {/* Step 1: Role Selection */}
          {step === 1 && (
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Welcome! 👋</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Let's get you started. How do you want to use NextGen Blog?
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <button
                  onClick={() => handleRoleSelection('READER')}
                  className="p-6 border-2 border-gray-200 dark:border-gray-800 rounded-xl hover:border-primary-600 transition-colors text-left group"
                >
                  <div className="text-4xl mb-3">📚</div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-600">
                    I'm a Reader
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Discover and enjoy amazing content from writers worldwide
                  </p>
                </button>
                <button
                  onClick={() => handleRoleSelection('WRITER')}
                  className="p-6 border-2 border-gray-200 dark:border-gray-800 rounded-xl hover:border-primary-600 transition-colors text-left group"
                >
                  <div className="text-4xl mb-3">✍️</div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-600">
                    I'm a Writer
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Share your stories and build an audience
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Profile Setup */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">
                {formData.role === 'WRITER'
                  ? 'Tell us about yourself'
                  : 'Set up your profile'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Bio {formData.role === 'WRITER' && '(Recommended)'}
                  </label>
                  <Textarea
                    placeholder="Tell others about yourself..."
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Website (Optional)
                  </label>
                  <Input
                    type="url"
                    placeholder="https://yourwebsite.com"
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                  />
                </div>
                <div className="flex space-x-3">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button onClick={() => setStep(3)} className="flex-1">
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Interests */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">
                What interests you?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Select topics you'd like to read about
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                {INTERESTS.map((interest) => (
                  <Badge
                    key={interest}
                    variant={
                      formData.interests.includes(interest)
                        ? 'default'
                        : 'outline'
                    }
                    className="cursor-pointer text-base px-4 py-2"
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button
                  onClick={handleComplete}
                  disabled={loading || formData.interests.length === 0}
                  className="flex-1"
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="mr-2 h-4 w-4" />
                  )}
                  Complete Setup
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

