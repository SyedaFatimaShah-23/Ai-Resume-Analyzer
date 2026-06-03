import { FileSearch, Zap } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
              <FileSearch className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-slate-900 font-bold text-lg tracking-tight">ResumeMatch</span>
              <span className="ml-2 text-xs bg-blue-50 text-blue-600 font-semibold px-2 py-0.5 rounded-full border border-blue-100">AI</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">AI-powered resume analysis</span>
          </div>
        </div>
      </div>
    </header>
  );
}
