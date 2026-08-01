import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const name = String(req.body?.name || '').trim().slice(0, 120);
    const email = String(req.body?.email || '').trim().slice(0, 160);
    const company = String(req.body?.company || '').trim().slice(0, 160);
    const message = String(req.body?.message || '').trim().slice(0, 2000);

    if (name.length < 2) return res.status(400).json({ error: 'Name is required.' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
      return res.status(400).json({ error: 'Enter a valid work email.' });
    if (message.length < 10)
      return res.status(400).json({ error: 'Add a line or two about the role.' });

    const { data, error } = await supabase
      .from('inquiries')
      .insert({ name, email, company, message, created_at: new Date().toISOString() })
      .select('id, created_at')
      .single();
    if (error) throw error;

    return res.status(201).json({ ok: true, id: data.id });
  } catch (err) {
    console.error('contact error:', err);
    return res.status(500).json({ error: err.message });
  }
}
