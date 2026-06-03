import { useState } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import ResultsDashboard from './components/ResultsDashboard';
import { analyzeResume } from './lib/analyzer';
import { supabase, getSessionId } from './lib/supabase';
import { AnalysisResult } from './types';

type AppState = 'input' | 'analyzing' | 'results';

export default function App() {
  const [state, setState] = useState<AppState>('input');
  const [result, setResult] = useState<AnalysisResult | null>(null);

  async function handleAnalyze(resume: string, job: string) {
    setState('analyzing');

    // Small delay for perceived "AI analysis" effect
    await new Promise((r) => setTimeout(r, 900));

    const analysisResult = analyzeResume(resume, job);
    setResult(analysisResult);
    setState('results');

    // Persist to Supabase in the background
    const sessionId = getSessionId();
    supabase.from('analyses').insert({
      session_id: sessionId,
      resume_text: resume.slice(0, 10000),
      job_description: job.slice(0, 10000),
      match_score: analysisResult.matchScore,
      matched_skills: analysisResult.matchedSkills,
      missing_skills: analysisResult.missingSkills,
      suggestions: analysisResult.suggestions,
      job_title: analysisResult.jobTitle,
    }).then();
  }

  function handleReset() {
    setResult(null);
    setState('input');
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {state === 'input' && (
          <>
            {/* Hero */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold px-4 py-1.5 rounded-full mb-5 uppercase tracking-wider">
                AI-Powered Resume Analysis
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
                Get Hired Faster with<br />
                <span className="text-blue-600">Smarter Resume Matching</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                Paste your resume and a job description. We'll instantly show your match score,
                identify skill gaps, and give you tailored suggestions to land the interview.
              </p>
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-3 gap-4 mb-10 max-w-xl mx-auto">
              {[
                { label: 'Match Score', value: 'Instant' },
                { label: 'Skill Gaps', value: 'Detailed' },
                { label: 'Suggestions', value: 'Actionable' },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <div className="text-lg font-black text-blue-600">{value}</div>
                  <div className="text-xs text-slate-500 font-semibold">{label}</div>
                </div>
              ))}
            </div>

            <InputSection onAnalyze={handleAnalyze} isAnalyzing={false} />
          </>
        )}

        {state === 'analyzing' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-blue-50 border-4 border-blue-100 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
              </div>
              <div className="absolute -inset-3 rounded-full border border-blue-200 animate-ping opacity-30" />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Analyzing your resume...</h2>
              <p className="text-slate-500 text-sm">Extracting keywords, scoring match, identifying gaps</p>
            </div>
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {state === 'results' && result && (
          <ResultsDashboard result={result} onReset={handleReset} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-16 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-black">R</span>
            </div>
            <span className="text-slate-600 text-sm font-semibold">ResumeMatch AI</span>
          </div>
          <p className="text-xs text-slate-400">
            AI-powered keyword matching and skill gap analysis. Results are suggestions, not guarantees.
          </p>
        </div>
      </footer>
    </div>
  );
}
