import { Lightbulb, ChevronRight } from 'lucide-react';

interface Props {
  suggestions: string[];
}

const SUGGESTION_ICONS = ['01', '02', '03', '04', '05', '06'];

export default function Suggestions({ suggestions }: Props) {
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <Lightbulb className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-900">Improvement Suggestions</h2>
          <p className="text-xs text-slate-500">{suggestions.length} actionable tips to strengthen your application</p>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-3">
          {suggestions.map((suggestion, i) => (
            <div
              key={i}
              className="group flex gap-4 p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 transition-all duration-150"
            >
              <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-blue-600 text-white text-xs font-black flex items-center justify-center shadow-sm">
                {SUGGESTION_ICONS[i]}
              </div>
              <div className="flex-1 flex items-start gap-3">
                <p className="text-sm text-slate-700 leading-relaxed flex-1">{suggestion}</p>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-400 flex-shrink-0 mt-0.5 transition-colors" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-400 text-center">
            Implement these suggestions to increase your match score and stand out to recruiters.
          </p>
        </div>
      </div>
    </div>
  );
}
