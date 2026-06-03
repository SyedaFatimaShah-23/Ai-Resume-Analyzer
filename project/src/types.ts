export interface AnalysisResult {
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  suggestions: string[];
  jobTitle: string;
  keywordDensity: Record<string, number>;
  resumeWordCount: number;
  jobWordCount: number;
}

export interface SavedAnalysis {
  id: string;
  session_id: string;
  resume_text: string;
  job_description: string;
  match_score: number;
  matched_skills: string[];
  missing_skills: string[];
  suggestions: string[];
  job_title: string;
  created_at: string;
}

export interface SkillCategory {
  name: string;
  skills: string[];
  color: string;
}
