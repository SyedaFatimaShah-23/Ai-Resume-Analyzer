import { Hash, FileText, Briefcase } from 'lucide-react';

interface Props {
  keywordDensity: Record<string, number>;
  resumeWordCount: number;
  jobWordCount: number;
  matchScore: number;
}

export default function KeywordsPanel({ keywordDensity, resumeWordCount, jobWordCount, matchScore }: Props) {
  const sorted = Object.entries(keywordDensity)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12);

  const maxCount = sorted.length > 0 ? Math.max(...sorted.map(([, c]) => c)) : 1;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
        <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
          <Hash className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-900">Keyword Frequency</h2>
          <p className="text-xs text-slate-500">Matched keywords and their importance in the job posting</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-blue-50 rounded-xl border border-blue-100">
            <div className="text-2xl font-black text-blue-600">{matchScore}%</div>
            <div className="text-xs text-blue-500 font-semibold mt-0.5">Match Rate</div>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <div className="text-2xl font-black text-slate-700">{resumeWordCount}</div>
            </div>
            <div className="text-xs text-slate-500 font-semibold mt-0.5">Resume Words</div>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-slate-500" />
              <div className="text-2xl font-black text-slate-700">{jobWordCount}</div>
            </div>
            <div className="text-xs text-slate-500 font-semibold mt-0.5">Job Words</div>
          </div>
        </div>

        {/* Keyword bars */}
        {sorted.length > 0 ? (
          <div>
            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-3">Top Matched Keywords</h3>
            <div className="space-y-2.5">
              {sorted.map(([keyword, count]) => (
                <div key={keyword} className="flex items-center gap-3">
                  <div className="w-28 text-xs font-semibold text-slate-700 text-right capitalize truncate flex-shrink-0">
                    {keyword}
                  </div>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-700"
                      style={{ width: `${(count / maxCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-400 font-semibold w-6 text-right flex-shrink-0">
                    {count}×
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-3">Numbers show how many times each keyword appears in the job description</p>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-slate-400">No matched keywords to display frequency for.</p>
          </div>
        )}
      </div>
    </div>
  );
}
