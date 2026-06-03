import { useState, useRef } from 'react';
import { FileText, Briefcase, Sparkles, ChevronRight, AlertCircle } from 'lucide-react';
import { SAMPLE_RESUME, SAMPLE_JOB } from '../data/samples';
import FileUploadZone from './FileUploadZone';

interface Props {
  onAnalyze: (resume: string, job: string) => void;
  isAnalyzing: boolean;
}

export default function InputSection({ onAnalyze, isAnalyzing }: Props) {
  const [resume, setResume] = useState('');
  const [job, setJob] = useState('');
  const [error, setError] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);

  function loadSamples() {
    setResume(SAMPLE_RESUME);
    setJob(SAMPLE_JOB);
    setError('');
    setUploadedFileName('');
  }

  function handleFileProcessed(text: string, fileName: string) {
    setResume(text);
    setError('');
    setUploadedFileName(fileName);
    setShowManualInput(false);
  }

  function handleFileError(errorMsg: string) {
    setError(errorMsg);
  }

  function handleAnalyze() {
    if (!resume.trim() || !job.trim()) {
      setError('Please fill in both your resume and the job description before analyzing.');
      return;
    }
    if (resume.trim().length < 50) {
      setError('Your resume seems too short. Please paste your full resume.');
      return;
    }
    if (job.trim().length < 50) {
      setError('The job description seems too short. Please paste the full job posting.');
      return;
    }
    setError('');
    onAnalyze(resume, job);
  }

  return (
    <div className="space-y-6">
      {/* Quick demo banner */}
      <div className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-2xl px-5 py-3.5">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-blue-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-blue-900">Try a live demo</p>
            <p className="text-xs text-blue-600">Load sample resume and job description to see the analyzer in action</p>
          </div>
        </div>
        <button
          onClick={loadSamples}
          className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 bg-white border border-blue-200 hover:border-blue-300 rounded-xl px-4 py-2 transition-all duration-150 whitespace-nowrap shadow-sm hover:shadow"
        >
          Load Example
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Input panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Resume panel */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-fit lg:h-auto">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Your Resume</h3>
                <p className="text-xs text-slate-500">Upload or paste below</p>
              </div>
            </div>
          </div>

          {/* File upload zone */}
          <div className="px-5 py-4 border-b border-slate-100">
            <FileUploadZone onFileProcessed={handleFileProcessed} onError={handleFileError} />
          </div>

          {/* File uploaded indicator */}
          {uploadedFileName && (
            <div className="px-5 py-3 border-b border-slate-100 bg-emerald-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                <span className="text-emerald-700 font-semibold truncate">
                  {uploadedFileName}
                </span>
              </div>
              <button
                onClick={() => {
                  setUploadedFileName('');
                  setShowManualInput(true);
                }}
                className="text-xs text-slate-500 hover:text-blue-600 transition-colors"
              >
                Clear
              </button>
            </div>
          )}

          {/* Manual input toggle */}
          {!showManualInput && resume && !uploadedFileName && (
            <div className="px-5 py-2.5 border-b border-slate-100 bg-slate-50/50 text-center">
              <button
                onClick={() => setShowManualInput(false)}
                className="text-xs text-slate-500"
              >
                Continue editing
              </button>
            </div>
          )}

          {/* Manual textarea with toggle */}
          {showManualInput || !uploadedFileName ? (
            <>
              <textarea
                value={resume}
                onChange={(e) => {
                  setResume(e.target.value);
                  setError('');
                }}
                placeholder={uploadedFileName ? 'Edit the extracted text above or paste additional content...' : 'Paste your resume text here...&#10;&#10;Include your:&#10;• Work experience&#10;• Skills&#10;• Education&#10;• Projects'}
                className={`flex-1 w-full p-5 text-sm text-slate-700 placeholder-slate-400 resize-none border-none outline-none font-mono leading-relaxed ${
                  uploadedFileName ? 'min-h-40' : 'min-h-72 lg:min-h-96'
                }`}
              />
              <div className="px-5 py-2.5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                <span className="text-xs text-slate-400">
                  {resume.trim() ? `${resume.split(/\s+/).filter(Boolean).length} words` : 'No content'}
                </span>
                {resume.trim() && (
                  <button
                    onClick={() => setResume('')}
                    className="text-xs text-slate-400 hover:text-red-500 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="px-5 py-4 text-xs text-slate-500">
              File extracted and ready for analysis.{' '}
              <button
                onClick={() => setShowManualInput(true)}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Edit text
              </button>
            </div>
          )}
        </div>

        {/* Job description panel */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2.5 bg-slate-50/50">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Job Description</h3>
              <p className="text-xs text-slate-500">Paste the job posting you're applying to</p>
            </div>
          </div>
          <textarea
            value={job}
            onChange={(e) => { setJob(e.target.value); setError(''); }}
            placeholder="Paste the job description here...&#10;&#10;Include the:&#10;• Job title and responsibilities&#10;• Required qualifications&#10;• Preferred skills&#10;• Tech stack or tools"
            className="flex-1 w-full p-5 text-sm text-slate-700 placeholder-slate-400 resize-none border-none outline-none min-h-72 lg:min-h-96 font-mono leading-relaxed"
          />
          <div className="px-5 py-2.5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
            <span className="text-xs text-slate-400">
              {job.trim() ? `${job.split(/\s+/).filter(Boolean).length} words` : 'No content'}
            </span>
            {job.trim() && (
              <button
                onClick={() => setJob('')}
                className="text-xs text-slate-400 hover:text-red-500 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3.5">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Analyze button */}
      <div className="flex justify-center">
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="relative flex items-center gap-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold px-10 py-4 rounded-2xl text-base transition-all duration-200 shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-200 hover:-translate-y-0.5 disabled:translate-y-0 disabled:shadow-md disabled:cursor-not-allowed"
        >
          {isAnalyzing ? (
            <>
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Analyze Match
            </>
          )}
        </button>
      </div>
    </div>
  );
}
