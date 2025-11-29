'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const success = login(email, password);
    
    if (success) {
      router.push('/dashboard');
    } else {
      setError('Invalid email or password');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#002D62] via-[#003d7a] to-[#005a9e]">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-[#E60000] rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-[#0055AA] rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-[#0080FF] rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Glassmorphism Card */}
      <div className="relative w-full max-w-md">
        <Card className="border-none shadow-2xl backdrop-blur-xl bg-white/10 text-white overflow-hidden">
          {/* Glass effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 pointer-events-none"></div>
          
          <CardHeader className="space-y-1 pb-6 relative z-10">
            <div className="flex justify-center mb-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-2xl ring-2 ring-white/30">
                <Image 
                  src="/app-logo.png" 
                  alt="V Studio Logo" 
                  width={120} 
                  height={120}
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <CardTitle className="text-4xl text-center font-bold text-white drop-shadow-lg">
              V Studio
            </CardTitle>
            <CardDescription className="text-center text-base text-white/90 font-medium">
              Sign in to access your invoices and quotations
            </CardDescription>
          </CardHeader>
          
          <CardContent className="relative z-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-semibold">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="yourname@vstudio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60 backdrop-blur-sm focus:bg-white/30 focus:border-white/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white font-semibold">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60 backdrop-blur-sm focus:bg-white/30 focus:border-white/50 transition-all"
                />
              </div>
              {error && (
                <div className="text-sm text-white bg-red-500/30 backdrop-blur-sm border border-red-300/50 rounded-lg p-3 font-medium">
                  {error}
                </div>
              )}
              <Button 
                type="submit" 
                className="w-full bg-white text-[#002D62] hover:bg-white/90 font-bold text-lg h-12 shadow-xl transition-all transform hover:scale-105" 
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
