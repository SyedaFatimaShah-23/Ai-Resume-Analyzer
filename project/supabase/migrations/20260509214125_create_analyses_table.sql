/*
  # Create Analyses Table

  ## Purpose
  Stores resume analysis results for history tracking in the AI Resume Analyzer app.

  ## New Tables
  - `analyses`
    - `id` (uuid, primary key): Unique identifier
    - `session_id` (text): Client-generated session identifier for grouping user analyses
    - `resume_text` (text): The resume content submitted for analysis
    - `job_description` (text): The job description submitted for comparison
    - `match_score` (int): Calculated match percentage (0–100)
    - `matched_skills` (jsonb): Array of skills found in both resume and job description
    - `missing_skills` (jsonb): Array of skills in job description but not in resume
    - `suggestions` (jsonb): Array of improvement suggestion strings
    - `job_title` (text): Extracted or inferred job title
    - `created_at` (timestamptz): Timestamp of analysis creation

  ## Security
  - RLS enabled
  - Anon and authenticated users can INSERT new analyses
  - Anon and authenticated users can SELECT analyses by session_id
  - No UPDATE or DELETE policies (analyses are immutable records)

  ## Notes
  - session_id is generated client-side (UUID stored in localStorage) for grouping
  - Data is not sensitive; this is a public analysis tool
*/

CREATE TABLE IF NOT EXISTS analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL DEFAULT '',
  resume_text text NOT NULL DEFAULT '',
  job_description text NOT NULL DEFAULT '',
  match_score integer NOT NULL DEFAULT 0,
  matched_skills jsonb NOT NULL DEFAULT '[]'::jsonb,
  missing_skills jsonb NOT NULL DEFAULT '[]'::jsonb,
  suggestions jsonb NOT NULL DEFAULT '[]'::jsonb,
  job_title text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS analyses_session_id_idx ON analyses(session_id);
CREATE INDEX IF NOT EXISTS analyses_created_at_idx ON analyses(created_at DESC);

CREATE POLICY "Anon users can insert analyses"
  ON analyses FOR INSERT
  TO anon, authenticated
  WITH CHECK (session_id IS NOT NULL AND char_length(session_id) > 0);

CREATE POLICY "Users can view analyses by session"
  ON analyses FOR SELECT
  TO anon, authenticated
  USING (session_id IS NOT NULL AND char_length(session_id) > 0);
