export default function Loading() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="mb-8 animate-pulse">
          <img 
            src="/logo.jpg" 
            alt="V Studio" 
            className="w-48 h-48 mx-auto rounded-3xl shadow-2xl shadow-blue-500/50"
          />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">V STUDIO</h1>
        <div className="flex items-center justify-center space-x-2">
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        <p className="text-blue-200 mt-4">Loading your workspace...</p>
      </div>
    </div>
  );
}
