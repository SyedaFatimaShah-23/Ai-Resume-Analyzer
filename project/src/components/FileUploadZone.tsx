import { useState, useRef } from 'react';
import { Upload, CheckCircle2, AlertCircle, Loader, File, X } from 'lucide-react';
import { extractResumeText, ExtractionResult } from '../lib/fileExtractor';

interface Props {
  onFileProcessed: (text: string, fileName: string) => void;
  onError: (error: string) => void;
}

export default function FileUploadZone({ onFileProcessed, onError }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ACCEPTED_TYPES = '.pdf,.docx,.jpg,.jpeg,.png,.gif,.bmp,.webp,.txt';

  async function processFile(file: File) {
    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      onError('File is too large. Maximum size is 50MB.');
      return;
    }

    setIsProcessing(true);
    setShowResult(false);
    onError('');

    const extractionResult = await extractResumeText(file);
    setResult(extractionResult);
    setShowResult(true);

    if (extractionResult.success) {
      onFileProcessed(extractionResult.text, extractionResult.fileName);
    } else {
      onError(extractionResult.error || 'Failed to process file.');
    }

    setIsProcessing(false);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFile(files[0]);
    }
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      processFile(files[0]);
    }
    e.target.value = '';
  }

  function clearResult() {
    setResult(null);
    setShowResult(false);
  }

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-blue-400 bg-blue-50'
            : isProcessing
            ? 'border-slate-200 bg-slate-50'
            : 'border-slate-300 bg-white hover:border-blue-300 hover:bg-blue-50/40'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES}
          onChange={handleFileInput}
          disabled={isProcessing}
          className="hidden"
        />

        {isProcessing ? (
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border-3 border-slate-200 rounded-full" />
              <div className="absolute inset-0 border-3 border-transparent border-t-blue-600 rounded-full animate-spin" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Processing file...</p>
              <p className="text-xs text-slate-500 mt-0.5">Extracting text and analyzing</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Upload className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                Drag and drop your resume here
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                or click to browse files
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 justify-center mt-2">
              {['PDF', 'DOCX', 'JPG/PNG', 'TXT'].map((type) => (
                <span
                  key={type}
                  className="inline-block text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg"
                >
                  {type}
                </span>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Max file size: 50MB
            </p>
          </div>
        )}
      </div>

      {/* Result feedback */}
      {showResult && result && (
        <div
          className={`border rounded-xl p-3.5 flex items-start gap-3 animate-fadeIn ${
            result.success
              ? 'bg-emerald-50 border-emerald-200'
              : 'bg-red-50 border-red-200'
          }`}
        >
          {result.success ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1 min-w-0">
            <p
              className={`text-sm font-semibold ${
                result.success ? 'text-emerald-900' : 'text-red-900'
              }`}
            >
              {result.success ? 'Resume processed successfully' : 'Failed to process resume'}
            </p>
            <div className="flex items-center justify-between gap-2 mt-1">
              <div className="flex items-center gap-2 min-w-0">
                <File className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                <p className="text-xs text-slate-600 truncate font-mono">
                  {result.fileName}
                </p>
              </div>
              {result.success && (
                <p className="text-xs text-slate-500 flex-shrink-0">
                  {result.text.split(/\s+/).filter(Boolean).length} words
                </p>
              )}
            </div>
            {!result.success && result.error && (
              <p className="text-xs text-red-700 mt-1.5">{result.error}</p>
            )}
            {result.success && (
              <p className="text-xs text-slate-500 mt-1">
                Processed in {result.processingTime}ms
              </p>
            )}
          </div>
          <button
            onClick={clearResult}
            className="text-slate-400 hover:text-slate-600 flex-shrink-0 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
