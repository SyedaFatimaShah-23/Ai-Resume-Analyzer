import { AnalysisResult } from '../types';

const TECH_SKILLS = [
  // Frontend
  'react', 'vue', 'angular', 'svelte', 'next.js', 'nuxt', 'gatsby', 'remix',
  'typescript', 'javascript', 'html', 'css', 'sass', 'scss', 'tailwind', 'bootstrap',
  'webpack', 'vite', 'babel', 'eslint', 'jest', 'cypress', 'playwright', 'storybook',
  'redux', 'mobx', 'zustand', 'recoil', 'graphql', 'apollo', 'react query',
  // Backend
  'node.js', 'express', 'fastapi', 'django', 'flask', 'spring', 'laravel',
  'ruby on rails', 'asp.net', 'nestjs', 'hapi', 'koa', 'fastify',
  // Languages
  'python', 'java', 'c++', 'c#', 'go', 'golang', 'rust', 'ruby', 'php',
  'swift', 'kotlin', 'scala', 'r', 'matlab', 'perl', 'lua', 'haskell', 'elixir',
  // Databases
  'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'sqlite', 'cassandra',
  'dynamodb', 'firestore', 'supabase', 'prisma', 'sequelize', 'typeorm',
  // Cloud & DevOps
  'aws', 'amazon web services', 'gcp', 'google cloud', 'azure', 'microsoft azure',
  'docker', 'kubernetes', 'terraform', 'ansible', 'helm', 'prometheus', 'grafana',
  'ci/cd', 'jenkins', 'github actions', 'circleci', 'travis ci', 'gitlab ci',
  'linux', 'unix', 'bash', 'shell scripting', 'powershell', 'nginx', 'apache',
  // AI/ML
  'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'scikit-learn',
  'keras', 'nlp', 'computer vision', 'data science', 'data analysis', 'data engineering',
  'pandas', 'numpy', 'matplotlib', 'seaborn', 'jupyter', 'spark', 'hadoop',
  'tableau', 'power bi', 'looker', 'dbt', 'airflow', 'mlflow',
  // Tools
  'git', 'github', 'gitlab', 'bitbucket', 'jira', 'confluence', 'notion',
  'figma', 'sketch', 'adobe xd', 'postman', 'swagger', 'openapi',
  // Practices
  'rest api', 'restful', 'microservices', 'serverless', 'devops', 'sre',
  'tdd', 'test-driven', 'agile', 'scrum', 'kanban', 'devsecops',
  'object-oriented', 'functional programming', 'design patterns', 'solid principles',
  'system design', 'distributed systems', 'event-driven', 'message queue',
  'rabbitmq', 'kafka', 'grpc', 'websocket', 'oauth', 'jwt', 'graphql',
];

const SOFT_SKILLS = [
  'leadership', 'communication', 'teamwork', 'team player', 'collaboration',
  'problem solving', 'problem-solving', 'critical thinking', 'analytical',
  'time management', 'project management', 'product management',
  'adaptability', 'flexibility', 'creativity', 'innovation', 'initiative',
  'attention to detail', 'detail-oriented', 'organized', 'multitasking',
  'mentoring', 'coaching', 'presentation', 'stakeholder management',
  'cross-functional', 'strategic thinking', 'decision making',
];

const CERTIFICATIONS = [
  'aws certified', 'google certified', 'azure certified', 'gcp certified',
  'comptia', 'cisco', 'pmp', 'csm', 'safe', 'togaf', 'itil',
  'cpa', 'cfa', 'cissp', 'ceh', 'oscp',
];

const ALL_SKILLS = [...TECH_SKILLS, ...SOFT_SKILLS, ...CERTIFICATIONS];

const STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be',
  'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
  'would', 'could', 'should', 'may', 'might', 'must', 'can', 'not',
  'this', 'that', 'these', 'those', 'it', 'its', 'we', 'our', 'you',
  'your', 'they', 'their', 'he', 'she', 'his', 'her', 'i', 'me', 'my',
  'experience', 'work', 'working', 'years', 'year', 'team', 'role',
  'ability', 'skills', 'strong', 'excellent', 'good', 'great', 'well',
  'including', 'such', 'also', 'both', 'each', 'more', 'most', 'other',
  'into', 'through', 'during', 'before', 'after', 'above', 'below',
  'between', 'out', 'off', 'over', 'under', 'again', 'then', 'once',
  'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'few',
  'while', 'about', 'per', 'than', 'up', 'just', 'who', 'what',
]);

function normalizeText(text: string): string {
  return text.toLowerCase().replace(/[^\w\s.#+/-]/g, ' ').replace(/\s+/g, ' ').trim();
}

function extractKnownSkills(text: string): string[] {
  const normalized = normalizeText(text);
  const found: string[] = [];
  for (const skill of ALL_SKILLS) {
    const pattern = new RegExp(`\\b${skill.replace(/[.+#]/g, '\\$&')}\\b`, 'i');
    if (pattern.test(normalized)) {
      found.push(skill);
    }
  }
  return found;
}

function extractGeneralKeywords(text: string): string[] {
  const normalized = normalizeText(text);
  const words = normalized.split(/\s+/);
  const keywords: string[] = [];

  for (let i = 0; i < words.length; i++) {
    const word = words[i].replace(/[^a-z0-9#+.-]/g, '');
    if (word.length >= 4 && !STOPWORDS.has(word)) {
      keywords.push(word);
    }
    // Check bigrams
    if (i < words.length - 1) {
      const bigram = `${words[i]} ${words[i + 1]}`.replace(/[^a-z0-9 #+.-]/g, '');
      if (bigram.length >= 6 && !STOPWORDS.has(words[i]) && !STOPWORDS.has(words[i + 1])) {
        keywords.push(bigram);
      }
    }
  }
  return [...new Set(keywords)];
}

function inferJobTitle(jobDescription: string): string {
  const titlePatterns = [
    /(?:position|role|title|job):\s*([^\n,]+)/i,
    /(?:we are looking for|seeking|hiring)\s+(?:a|an)?\s*([^\n,]+?)\s*(?:to|who|with)/i,
    /^([^\n]+?(?:engineer|developer|designer|manager|analyst|scientist|architect|lead|director|specialist|consultant)[^\n]*)/im,
  ];
  for (const pattern of titlePatterns) {
    const match = jobDescription.match(pattern);
    if (match) return match[1].trim().substring(0, 60);
  }
  // Fallback: look for common job title words in first 200 chars
  const preview = jobDescription.substring(0, 200).toLowerCase();
  const titles = ['engineer', 'developer', 'designer', 'manager', 'analyst', 'scientist', 'architect'];
  for (const title of titles) {
    if (preview.includes(title)) {
      const idx = preview.indexOf(title);
      const start = Math.max(0, idx - 20);
      return jobDescription.substring(start, idx + title.length + 15).trim().substring(0, 50);
    }
  }
  return 'This Position';
}

function generateSuggestions(
  missingSkills: string[],
  matchScore: number,
  resumeText: string,
  jobDescription: string
): string[] {
  const suggestions: string[] = [];
  const resumeLower = resumeText.toLowerCase();

  // Score-based global suggestions
  if (matchScore < 40) {
    suggestions.push('Significantly tailor your resume to match this specific role — focus on aligning your experience with the job\'s core requirements.');
  } else if (matchScore < 65) {
    suggestions.push('Your resume covers some key areas. Strengthen alignment by incorporating more of the job\'s specific language and requirements.');
  }

  // Missing skills suggestions
  const topMissing = missingSkills.slice(0, 4);
  if (topMissing.length > 0) {
    const techMissing = topMissing.filter(s => TECH_SKILLS.includes(s));
    const softMissing = topMissing.filter(s => SOFT_SKILLS.includes(s));
    if (techMissing.length > 0) {
      suggestions.push(`Add experience or projects demonstrating: ${techMissing.slice(0, 3).map(s => `"${s}"`).join(', ')} — these are explicitly required in the job description.`);
    }
    if (softMissing.length > 0) {
      suggestions.push(`Include examples of ${softMissing.slice(0, 2).join(' and ')} in your bullet points with concrete outcomes.`);
    }
  }

  // Quantification check
  const hasNumbers = /\d+%|\d+ years|\d+\+|increased by|\$[\d,]+|reduced|improved/i.test(resumeText);
  if (!hasNumbers) {
    suggestions.push('Quantify your achievements with specific metrics (e.g., "Reduced load time by 40%", "Led a team of 8 engineers", "Increased conversion by 25%").');
  }

  // Action verbs check
  const actionVerbs = ['led', 'built', 'designed', 'developed', 'implemented', 'architected', 'managed', 'delivered', 'optimized'];
  const hasActionVerbs = actionVerbs.some(v => resumeLower.includes(v));
  if (!hasActionVerbs) {
    suggestions.push('Start each bullet point with a strong action verb (Built, Designed, Led, Delivered, Optimized, Architected) to convey impact clearly.');
  }

  // Summary/objective check
  if (!resumeLower.includes('summary') && !resumeLower.includes('objective') && !resumeLower.includes('profile')) {
    suggestions.push('Add a 2–3 sentence professional summary at the top that directly mirrors the job description\'s key requirements and your most relevant experience.');
  }

  // Length/keyword density
  const wordCount = resumeText.split(/\s+/).filter(Boolean).length;
  if (wordCount < 200) {
    suggestions.push('Your resume appears brief. Expand each role with 3–5 accomplishment-driven bullet points that demonstrate scope and impact.');
  } else if (wordCount > 1000) {
    suggestions.push('Consider trimming your resume to 1–2 pages, keeping only the most relevant experience for this specific role.');
  }

  // Job description keywords suggestion
  const jobWords = jobDescription.split(/\s+/).filter(w => w.length > 5 && !STOPWORDS.has(w.toLowerCase()));
  const uniqueJobWords = [...new Set(jobWords.map(w => w.toLowerCase()))].slice(0, 20);
  const missingFromResume = uniqueJobWords.filter(w => !resumeLower.includes(w)).slice(0, 5);
  if (missingFromResume.length >= 3) {
    suggestions.push(`Mirror the job description's exact language — naturally integrate key phrases like "${missingFromResume.slice(0, 3).join('", "')}" into your experience descriptions.`);
  }

  return suggestions.slice(0, 6);
}

function buildKeywordDensity(jobText: string, matchedSkills: string[]): Record<string, number> {
  const density: Record<string, number> = {};
  const normalized = normalizeText(jobText);
  for (const skill of matchedSkills) {
    const regex = new RegExp(`\\b${skill.replace(/[.+#]/g, '\\$&')}\\b`, 'gi');
    const matches = normalized.match(regex);
    density[skill] = matches ? matches.length : 0;
  }
  return density;
}

export function analyzeResume(resumeText: string, jobDescription: string): AnalysisResult {
  const jobSkills = extractKnownSkills(jobDescription);
  const resumeSkills = extractKnownSkills(resumeText);
  const jobGeneral = extractGeneralKeywords(jobDescription);
  const resumeGeneral = new Set(extractGeneralKeywords(resumeText));

  // Skill-based matching
  const matchedSkills = jobSkills.filter(s => resumeSkills.includes(s));
  const missingSkills = jobSkills.filter(s => !resumeSkills.includes(s));

  // General keyword matching for score boost
  const matchedGeneral = jobGeneral.filter(w => resumeGeneral.has(w));
  const generalBoost = jobGeneral.length > 0 ? (matchedGeneral.length / jobGeneral.length) * 30 : 0;

  // Calculate score
  let score = 0;
  if (jobSkills.length > 0) {
    const skillScore = (matchedSkills.length / jobSkills.length) * 70;
    score = Math.round(skillScore + generalBoost);
  } else {
    // No known skills found — rely on general keyword match
    score = Math.round(generalBoost * 2);
  }
  score = Math.min(100, Math.max(0, score));

  const suggestions = generateSuggestions(missingSkills, score, resumeText, jobDescription);
  const jobTitle = inferJobTitle(jobDescription);
  const keywordDensity = buildKeywordDensity(jobDescription, matchedSkills);
  const resumeWordCount = resumeText.split(/\s+/).filter(Boolean).length;
  const jobWordCount = jobDescription.split(/\s+/).filter(Boolean).length;

  return {
    matchScore: score,
    matchedSkills,
    missingSkills,
    suggestions,
    jobTitle,
    keywordDensity,
    resumeWordCount,
    jobWordCount,
  };
}
