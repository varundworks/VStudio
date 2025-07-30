'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import VStudioIcon from '@/components/v-studio-icon';
import { useAuth } from '@/contexts/auth-context';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import type { FirebaseError } from 'firebase/app';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const { signup } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(email, password);
      toast({ title: 'Account Created!', description: 'You have been successfully signed up.' });
      router.push('/invoices/new');
    } catch (error) {
      console.error(error);
      const firebaseError = error as FirebaseError;
      let description = 'Could not create an account. Please try again.';
      if (firebaseError.code === 'auth/email-already-in-use') {
        description = 'This email is already registered. Please log in or use a different email.';
      } else if (firebaseError.code === 'auth/weak-password') {
        description = 'The password is too weak. Please choose a stronger password.';
      }
      toast({ variant: 'destructive', title: 'Signup Failed', description });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader className="text-center">
          <VStudioIcon className="mx-auto h-12 w-12" />
          <CardTitle className="text-2xl font-headline mt-4">Create an account</CardTitle>
          <CardDescription>Enter your information to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="full-name">Full Name</Label>
                <Input id="full-name" placeholder="Max Robinson" required value={fullName} onChange={(e) => setFullName(e.target.value)}/>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button type="submit" className="w-full">
                  Create account
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/" className="underline">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
