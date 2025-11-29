'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export function SplashScreen({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setShowSplash(false), 500); // Wait for fade animation
    }, 2000); // Show splash for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <div className={`fixed inset-0 bg-gradient-to-br from-[#002D62] via-[#003d7a] to-[#005a9e] flex items-center justify-center z-50 transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
        <div className="text-center">
          <div className="mb-8 animate-bounce">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl ring-4 ring-white/30 inline-block">
              <Image
                src="/app-logo.png"
                alt="V Studio"
                width={180}
                height={180}
                className="object-contain"
                priority
              />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">V STUDIO</h1>
          <div className="flex items-center justify-center space-x-2 mt-8">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
            <div className="w-3 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
