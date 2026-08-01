import supabase from './db-client.js';

/**
 * The index — a real retrieval-augmented answerer over a fixed corpus of
 * resume lines and project READMEs. No generative model, no hallucination
 * surface: retrieval is BM25-style lexical scoring over the corpus, and the
 * answer is composed strictly from the retrieved chunk text. If nothing
 * scores above threshold it says so instead of inventing.
 *
 * Every query is timed and written to ask_queries so p50 latency is measured,
 * not claimed.
 */

const STOP = new Set(
  ('a an the and or but if then than that this those these is are was were be been being of in on at ' +
    'to for with by from as it its his her he she they them you your i me my we our do does did done ' +
    'how what when where which who whom why can could would should will shall may might must have has ' +
    'had about into over under again more most some such no nor not only own same so too very s t ' +
    'tell show give know about work worked works there here')
    .split(' ')
);

const SYNONYMS = {
  voice: ['voice', 'telephony', 'ivr', 'speech', 'call', 'twilio', 'tts', 'asr'],
  rag: ['rag', 'retrieval', 'chromadb', 'embedding', 'vector', 'chunk', 'hybrid', 'rerank'],
  latency: ['latency', 'p50', 'p95', 'ms', 'fast', 'speed', 'response', 'time'],
  award: ['award', 'outstanding', 'recognition', 'honor', 'won', 'win', 'prize', 'hackathon'],
  school: ['northeastern', 'university', 'ms', 'masters', 'degree', 'graduated', 'information', 'systems'],
  work: ['autoace', 'internship', 'role', 'engineer', 'employment', 'job', 'experience', 'shipped'],
  stack: ['python', 'typescript', 'react', 'fastapi', 'nextjs', 'postgres', 'supabase', 'stack', 'built'],
  contact: ['contact', 'email', 'hire', 'available', 'reach', 'call', 'resume', 'relocate'],
  vision: ['vision', 'yolo', 'detection', 'image', 'opencv', 'camera'],
  translate: ['translation', 'manipuri', 'transformer', 'bleu', 'nmt', 'language'],
};

function tokenize(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9+#. ]+/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP.has(w));
}

function expand(tokens) {
  const out = new Set(tokens);
  for (const t of tokens) {
    for (const bag of Object.values(SYNONYMS)) {
      if (bag.includes(t)) bag.forEach((w) => out.add(w));
    }
  }
  return [...out];
}

/** BM25 over the corpus. k1=1.4, b=0.72. */
function rank(query, docs) {
  const qRaw = tokenize(query);
  if (!qRaw.length) return [];
  const q = expand(qRaw);
  const qSet = new Set(qRaw);

  const N = docs.length;
  const tokenised = docs.map((d) => tokenize(`${d.title} ${d.body} ${d.tags || ''}`));
  const avgdl = tokenised.reduce((s, t) => s + t.length, 0) / Math.max(1, N);

  const df = new Map();
  tokenised.forEach((toks) => {
    new Set(toks).forEach((t) => df.set(t, (df.get(t) || 0) + 1));
  });

  const k1 = 1.4;
  const b = 0.72;

  return docs
    .map((doc, i) => {
      const toks = tokenised[i];
      const tf = new Map();
      toks.forEach((t) => tf.set(t, (tf.get(t) || 0) + 1));
      let score = 0;
      for (const term of q) {
        const f = tf.get(term);
        if (!f) continue;
        const n = df.get(term) || 0;
        const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
        const weight = qSet.has(term) ? 1 : 0.45; // expanded terms count less
        score += weight * idf * ((f * (k1 + 1)) / (f + k1 * (1 - b + (b * toks.length) / avgdl)));
      }
      if (doc.priority) score *= 1 + doc.priority * 0.12;
      return { doc, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b2) => b2.score - a.score);
}

/** Extractive composition: sentences from retrieved chunks, in rank order. */
function compose(query, hits) {
  const qTokens = new Set(expand(tokenize(query)));
  const picked = [];
  const seen = new Set();

  for (const hit of hits.slice(0, 3)) {
    const sentences = String(hit.doc.body)
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 24);
    const scored = sentences
      .map((s) => {
        const toks = tokenize(s);
        const overlap = toks.filter((t) => qTokens.has(t)).length;
        return { s, overlap: overlap / Math.max(4, toks.length ** 0.5) };
      })
      .sort((a, b) => b.overlap - a.overlap);
    for (const { s, overlap } of scored.slice(0, 2)) {
      const key = s.slice(0, 40).toLowerCase();
      if (overlap <= 0 || seen.has(key)) continue;
      seen.add(key);
      picked.push(s);
      if (picked.length >= 4) break;
    }
    if (picked.length >= 4) break;
  }

  if (!picked.length && hits.length) {
    picked.push(String(hits[0].doc.body).split(/(?<=[.!?])\s+/)[0]);
  }
  return picked.join(' ');
}

async function p50() {
  const { data } = await supabase
    .from('ask_queries')
    .select('latency_ms')
    .order('id', { ascending: false })
    .limit(200);
  if (!data || !data.length) return null;
  const sorted = data.map((r) => r.latency_ms).sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const [{ count }, { data: sugg }, median, { count: queries }] = await Promise.all([
        supabase.from('corpus_chunks').select('id', { count: 'exact', head: true }),
        supabase.from('ask_suggestions').select('*').order('sort', { ascending: true }),
        p50(),
        supabase.from('ask_queries').select('id', { count: 'exact', head: true }),
      ]);
      const { data: srcRows } = await supabase.from('corpus_chunks').select('source');
      const sources = [...new Set((srcRows || []).map((r) => r.source))];
      return res.status(200).json({
        corpus: count || 0,
        p50_ms: median ?? 0,
        queries: queries || 0,
        suggestions: (sugg || []).map((s) => s.question),
        sources,
      });
    }

    if (req.method === 'POST') {
      const started = Date.now();
      const question = String(req.body?.question || '').slice(0, 300).trim();
      if (question.length < 3) return res.status(400).json({ error: 'Ask a longer question.' });

      const { data: docs, error } = await supabase.from('corpus_chunks').select('*');
      if (error) throw error;

      const hits = rank(question, docs || []);
      const top = hits.slice(0, 4);
      const best = top[0]?.score ?? 0;
      const grounded = best >= 1.6;

      const answer = grounded
        ? compose(question, top)
        : "That is not in the indexed corpus. This index only contains Abhishek's resume lines and project READMEs — it will not guess. Try asking about voice agents, the retrieval stack, AutoAce, awards, or availability.";

      const latency = Date.now() - started;
      await supabase.from('ask_queries').insert({
        question,
        latency_ms: latency,
        grounded,
        top_source: grounded ? top[0].doc.source : null,
        created_at: new Date().toISOString(),
      });

      const median = await p50();

      return res.status(200).json({
        question,
        answer,
        grounded,
        latency_ms: latency,
        p50_ms: median ?? latency,
        corpus: (docs || []).length,
        k: top.length,
        sources: grounded
          ? top.map((h) => ({
              source: h.doc.source,
              title: h.doc.title,
              url: h.doc.url,
              score: Math.round(h.score * 100) / 100,
            }))
          : [],
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('ask error:', err);
    return res.status(500).json({ error: err.message });
  }
}
