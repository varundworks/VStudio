'use client';

import { useEffect, useState } from 'react';

export function SplashScreen({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center z-50 animate-fade-in">
        <div className="text-center">
          <div className="mb-8 animate-scale-in">
            <img 
              src="/logo.jpg" 
              alt="V Studio" 
              className="w-48 h-48 mx-auto rounded-3xl shadow-2xl shadow-blue-500/50"
            />
          </div>
          <h1 className="text-5xl font-bold text-white mb-2 animate-fade-in-up">V STUDIO</h1>
          <p className="text-xl text-blue-200 mb-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>Invoice & Quotation System</p>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
