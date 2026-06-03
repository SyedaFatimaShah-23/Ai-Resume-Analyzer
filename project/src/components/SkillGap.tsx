import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface Props {
  matched: string[];
  missing: string[];
}

const TECH_SKILLS_SET = new Set([
  'react', 'vue', 'angular', 'svelte', 'next.js', 'nuxt', 'gatsby', 'remix',
  'typescript', 'javascript', 'html', 'css', 'sass', 'scss', 'tailwind', 'bootstrap',
  'webpack', 'vite', 'babel', 'eslint', 'jest', 'cypress', 'playwright', 'storybook',
  'redux', 'mobx', 'zustand', 'recoil', 'graphql', 'apollo', 'react query',
  'node.js', 'express', 'fastapi', 'django', 'flask', 'spring', 'laravel',
  'ruby on rails', 'asp.net', 'nestjs', 'hapi', 'koa', 'fastify',
  'python', 'java', 'c++', 'c#', 'go', 'golang', 'rust', 'ruby', 'php',
  'swift', 'kotlin', 'scala', 'r', 'matlab', 'perl', 'lua', 'haskell', 'elixir',
  'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'sqlite', 'cassandra',
  'dynamodb', 'firestore', 'supabase', 'prisma', 'sequelize', 'typeorm',
  'aws', 'amazon web services', 'gcp', 'google cloud', 'azure', 'microsoft azure',
  'docker', 'kubernetes', 'terraform', 'ansible', 'helm', 'prometheus', 'grafana',
  'ci/cd', 'jenkins', 'github actions', 'circleci', 'travis ci', 'gitlab ci',
  'linux', 'unix', 'bash', 'shell scripting', 'powershell', 'nginx', 'apache',
  'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'scikit-learn',
  'keras', 'nlp', 'computer vision', 'data science', 'data analysis', 'data engineering',
  'pandas', 'numpy', 'matplotlib', 'seaborn', 'jupyter', 'spark', 'hadoop',
  'tableau', 'power bi', 'looker', 'dbt', 'airflow', 'mlflow',
  'git', 'github', 'gitlab', 'bitbucket', 'jira', 'confluence', 'notion',
  'figma', 'sketch', 'adobe xd', 'postman', 'swagger', 'openapi',
  'rest api', 'restful', 'microservices', 'serverless', 'devops', 'sre',
  'tdd', 'test-driven', 'agile', 'scrum', 'kanban', 'devsecops',
  'rabbitmq', 'kafka', 'grpc', 'websocket', 'oauth', 'jwt',
]);

function getSkillType(skill: string): 'tech' | 'soft' | 'practice' {
  if (TECH_SKILLS_SET.has(skill)) return 'tech';
  if (['agile', 'scrum', 'kanban', 'tdd', 'ci/cd', 'devops', 'microservices', 'serverless'].includes(skill)) return 'practice';
  return 'soft';
}

function capitalize(s: string) {
  return s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

interface SkillTagProps {
  skill: string;
  variant: 'matched' | 'missing';
}

function SkillTag({ skill, variant }: SkillTagProps) {
  const type = getSkillType(skill);
  if (variant === 'matched') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
        {capitalize(skill)}
      </span>
    );
  }
  const missingColor = type === 'tech'
    ? 'bg-red-50 text-red-700 border-red-200'
    : type === 'practice'
    ? 'bg-amber-50 text-amber-700 border-amber-200'
    : 'bg-orange-50 text-orange-700 border-orange-200';
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${missingColor}`}>
      <XCircle className="w-3 h-3 flex-shrink-0" />
      {capitalize(skill)}
    </span>
  );
}

export default function SkillGap({ matched, missing }: Props) {
  const hasData = matched.length > 0 || missing.length > 0;

  if (!hasData) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <h2 className="text-sm font-bold text-slate-900">Skill Analysis</h2>
        </div>
        <p className="text-sm text-slate-500">No specific skills detected. Try adding more technical keywords to both inputs.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-sm font-bold text-slate-900">Skill Gap Analysis</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {matched.length} matched · {missing.length} missing from resume
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Missing skills */}
        {missing.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Missing from Resume ({missing.length})
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {missing.map((skill) => (
                <SkillTag key={skill} skill={skill} variant="missing" />
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-3">
              These skills appear in the job description but are not found in your resume. Consider adding relevant ones.
            </p>
          </div>
        )}

        {/* Divider */}
        {missing.length > 0 && matched.length > 0 && (
          <div className="border-t border-slate-100" />
        )}

        {/* Matched skills */}
        {matched.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Skills Found ({matched.length})
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {matched.map((skill) => (
                <SkillTag key={skill} skill={skill} variant="matched" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
