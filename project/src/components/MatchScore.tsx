import { useEffect, useState } from 'react';
import { TrendingUp, Award, AlertTriangle, XCircle } from 'lucide-react';

interface Props {
  score: number;
  jobTitle: string;
  matchedCount: number;
  missingCount: number;
}

function getScoreConfig(score: number) {
  if (score >= 75) return {
    label: 'Excellent Match',
    description: 'Your resume strongly aligns with this role.',
    icon: Award,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    ring: 'from-emerald-400 to-emerald-600',
    bar: 'bg-emerald-500',
  };
  if (score >= 50) return {
    label: 'Good Match',
    description: 'Your resume covers many of the key requirements.',
    icon: TrendingUp,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    ring: 'from-blue-400 to-blue-600',
    bar: 'bg-blue-500',
  };
  if (score >= 30) return {
    label: 'Partial Match',
    description: 'Some alignment found — several key areas need work.',
    icon: AlertTriangle,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    ring: 'from-amber-400 to-amber-600',
    bar: 'bg-amber-500',
  };
  return {
    label: 'Low Match',
    description: 'Significant gaps found — tailoring recommended.',
    icon: XCircle,
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    ring: 'from-red-400 to-red-600',
    bar: 'bg-red-500',
  };
}

export default function MatchScore({ score, jobTitle, matchedCount, missingCount }: Props) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedBar, setAnimatedBar] = useState(0);
  const config = getScoreConfig(score);
  const Icon = config.icon;

  useEffect(() => {
    const duration = 1200;
    const steps = 60;
    const increment = score / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setAnimatedScore(score);
        setAnimatedBar(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(current));
        setAnimatedBar(current);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [score]);

  // SVG circle progress
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedBar / 100) * circumference;

  return (
    <div className={`bg-white rounded-2xl border ${config.border} shadow-sm overflow-hidden`}>
      <div className={`px-6 py-4 border-b ${config.border} ${config.bg}`}>
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${config.color}`} />
          <h2 className={`text-sm font-bold ${config.color}`}>Match Score</h2>
        </div>
        <p className="text-xs text-slate-500 mt-0.5 truncate">vs. {jobTitle}</p>
      </div>

      <div className="p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Circle progress */}
          <div className="relative flex-shrink-0">
            <svg width="140" height="140" className="-rotate-90">
              <circle cx="70" cy="70" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="10" />
              <circle
                cx="70" cy="70" r={radius}
                fill="none"
                stroke="url(#scoreGradient)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: 'stroke-dashoffset 0.05s linear' }}
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={score >= 75 ? '#34d399' : score >= 50 ? '#60a5fa' : score >= 30 ? '#fbbf24' : '#f87171'} />
                  <stop offset="100%" stopColor={score >= 75 ? '#059669' : score >= 50 ? '#2563eb' : score >= 30 ? '#d97706' : '#dc2626'} />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-black ${config.color}`}>{animatedScore}</span>
              <span className="text-sm text-slate-400 font-semibold">%</span>
            </div>
          </div>

          {/* Score details */}
          <div className="flex-1 space-y-4 w-full">
            <div>
              <h3 className={`text-xl font-bold ${config.color}`}>{config.label}</h3>
              <p className="text-sm text-slate-500 mt-1">{config.description}</p>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-slate-600">Matched Skills</span>
                  <span className="text-emerald-600">{matchedCount} found</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                    style={{ width: `${matchedCount + missingCount > 0 ? (matchedCount / (matchedCount + missingCount)) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-slate-600">Missing Skills</span>
                  <span className="text-red-500">{missingCount} gaps</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-400 rounded-full transition-all duration-1000"
                    style={{ width: `${matchedCount + missingCount > 0 ? (missingCount / (matchedCount + missingCount)) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overall bar */}
        <div className="mt-5 pt-5 border-t border-slate-100">
          <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>Overall compatibility</span>
            <span>{animatedScore}%</span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${config.bar} rounded-full transition-all duration-1000`}
              style={{ width: `${animatedBar}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-1.5">
            <span>0% — No match</span>
            <span>100% — Perfect</span>
          </div>
        </div>
      </div>
    </div>
  );
}
