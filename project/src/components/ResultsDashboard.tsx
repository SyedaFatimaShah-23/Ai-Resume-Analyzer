import { RotateCcw, Download } from 'lucide-react';
import { AnalysisResult } from '../types';
import MatchScore from './MatchScore';
import SkillGap from './SkillGap';
import Suggestions from './Suggestions';
import KeywordsPanel from './KeywordsPanel';

interface Props {
  result: AnalysisResult;
  onReset: () => void;
}

function handlePrint() {
  window.print();
}

export default function ResultsDashboard({ result, onReset }: Props) {
  return (
    <div className="space-y-5 animate-fadeIn print:space-y-6">
      {/* Actions bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Analysis Results</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Resume vs. <span className="font-semibold text-slate-700">{result.jobTitle}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 print:hidden">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-4 py-2 transition-all duration-150 shadow-sm hover:shadow"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download Report</span>
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl px-4 py-2 transition-all duration-150"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">New Analysis</span>
          </button>
        </div>
      </div>

      {/* Main score */}
      <MatchScore
        score={result.matchScore}
        jobTitle={result.jobTitle}
        matchedCount={result.matchedSkills.length}
        missingCount={result.missingSkills.length}
      />

      {/* Two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SkillGap matched={result.matchedSkills} missing={result.missingSkills} />
        <KeywordsPanel
          keywordDensity={result.keywordDensity}
          resumeWordCount={result.resumeWordCount}
          jobWordCount={result.jobWordCount}
          matchScore={result.matchScore}
        />
      </div>

      {/* Suggestions */}
      <Suggestions suggestions={result.suggestions} />
    </div>
  );
}
