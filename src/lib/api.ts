export type Project = {
  id: number;
  slug: string;
  title: string;
  cluster: 'voice' | 'retrieval' | 'vision' | 'systems';
  year: string;
  kind: string;
  blurb: string;
  metric_label: string;
  metric_value: string;
  stack: string;
  repo_url: string | null;
  demo_url: string | null;
  demo_label: string | null;
  sort: number;
};

export type Award = {
  id: number;
  title: string;
  org: string;
  year: string;
  detail: string;
  url: string | null;
  sort: number;
};

export type Experience = {
  id: number;
  role: string;
  org: string;
  period: string;
  location: string;
  detail: string;
  sort: number;
};

export type Skill = { id: number; name: string; group_name: string; sort: number };

export type Content = {
  awards: Award[];
  experience: Experience[];
  skills: Skill[];
};

export type AskSource = {
  source: string;
  title: string;
  url: string | null;
  score: number;
};

export type AskResult = {
  question: string;
  answer: string;
  grounded: boolean;
  sources: AskSource[];
  latency_ms: number;
  p50_ms: number;
  corpus: number;
  k: number;
};

export type AskMeta = {
  corpus: number;
  p50_ms: number;
  queries: number;
  suggestions: string[];
  sources: string[];
};

async function get<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return (await res.json()) as T;
}

export const getProjects = () => get<Project[]>('/api/projects');
export const getContent = () => get<Content>('/api/content');
export const getAskMeta = () => get<AskMeta>('/api/ask');

export async function ask(question: string): Promise<AskResult> {
  const res = await fetch('/api/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  });
  if (!res.ok) throw new Error('retrieval failed');
  return (await res.json()) as AskResult;
}

export async function sendContact(payload: {
  name: string;
  email: string;
  company: string;
  message: string;
}) {
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: 'Could not send' }));
    throw new Error(body.error || 'Could not send');
  }
  return res.json();
}

export const CLUSTERS = [
  { key: 'voice', label: 'Voice & telephony', index: 0 },
  { key: 'retrieval', label: 'Retrieval', index: 1 },
  { key: 'vision', label: 'Vision', index: 2 },
  { key: 'systems', label: 'Systems', index: 3 },
] as const;
