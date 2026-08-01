import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const [awards, experience, skills] = await Promise.all([
      supabase.from('awards').select('*').order('sort', { ascending: true }),
      supabase.from('experience').select('*').order('sort', { ascending: true }),
      supabase.from('skills').select('*').order('sort', { ascending: true }),
    ]);
    if (awards.error) throw awards.error;
    if (experience.error) throw experience.error;
    if (skills.error) throw skills.error;

    res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=600');
    return res.status(200).json({
      awards: awards.data,
      experience: experience.data,
      skills: skills.data,
    });
  } catch (err) {
    console.error('content error:', err);
    return res.status(500).json({ error: err.message });
  }
}
