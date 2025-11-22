'use client';

import type React from 'react';

import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { KeyRound } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock password reset
    setTimeout(() => {
      toast({
        title: 'Reset link sent',
        description: 'Check your email for password reset instructions',
      });
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-md">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                  <KeyRound className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="mt-4 text-2xl">Forgot Password?</CardTitle>
                <CardDescription>
                  {isSubmitted
                    ? "We've sent you a reset link"
                    : 'Enter your email to reset your password'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="space-y-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      We've sent a password reset link to{' '}
                      <span className="font-medium text-foreground">{email}</span>. Please check
                      your inbox and follow the instructions.
                    </p>
                    <Link href="/login" className="block">
                      <Button className="w-full">Back to Login</Button>
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                    <Link href="/login" className="block">
                      <Button variant="ghost" className="w-full">
                        Back to Login
                      </Button>
                    </Link>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
