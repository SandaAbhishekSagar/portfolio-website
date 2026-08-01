/**
 * Email you when a hire-form inquiry lands.
 * Uses Resend's test sender (onboarding@resend.dev) — no custom domain needed
 * as long as NOTIFY_EMAIL matches the email on your Resend account.
 */

const DEFAULT_NOTIFY = 'sabhisheksagar200@gmail.com';

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * @param {{ id: number|string, name: string, email: string, company?: string, message: string, created_at?: string }} inquiry
 * @returns {Promise<{ ok: boolean, skipped?: boolean, error?: string }>}
 */
export async function notifyInquiry(inquiry) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('notify-inquiry: RESEND_API_KEY missing — skip email');
    return { ok: false, skipped: true, error: 'RESEND_API_KEY missing' };
  }

  const to = (process.env.NOTIFY_EMAIL || DEFAULT_NOTIFY).trim();
  const company = (inquiry.company || '').trim();
  const subject = company
    ? `New inquiry from ${inquiry.name} · ${company}`
    : `New inquiry from ${inquiry.name}`;

  const when = inquiry.created_at
    ? new Date(inquiry.created_at).toUTCString()
    : new Date().toUTCString();

  const text = [
    `New portfolio inquiry (#${inquiry.id})`,
    '',
    `Name: ${inquiry.name}`,
    `Email: ${inquiry.email}`,
    `Company: ${company || '—'}`,
    `When: ${when}`,
    '',
    'Message:',
    inquiry.message,
    '',
    'Reply to this email to respond to the sender.',
  ].join('\n');

  const html = `
    <div style="font-family:ui-sans-serif,system-ui,sans-serif;line-height:1.5;color:#1a1412">
      <p style="margin:0 0 12px"><strong>New portfolio inquiry</strong> (#${escapeHtml(inquiry.id)})</p>
      <table style="border-collapse:collapse;font-size:14px">
        <tr><td style="padding:4px 12px 4px 0;color:#666">Name</td><td>${escapeHtml(inquiry.name)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666">Email</td><td><a href="mailto:${escapeHtml(inquiry.email)}">${escapeHtml(inquiry.email)}</a></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666">Company</td><td>${escapeHtml(company || '—')}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666">When</td><td>${escapeHtml(when)}</td></tr>
      </table>
      <p style="margin:16px 0 6px;color:#666;font-size:13px">Message</p>
      <pre style="white-space:pre-wrap;font-family:inherit;background:#f6f2ef;padding:12px 14px;border-radius:8px;margin:0">${escapeHtml(inquiry.message)}</pre>
      <p style="margin:16px 0 0;font-size:12px;color:#888">Reply to this email to respond to the sender.</p>
    </div>
  `.trim();

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Portfolio <onboarding@resend.dev>',
      to: [to],
      reply_to: inquiry.email,
      subject,
      text,
      html,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    console.error('notify-inquiry: Resend error', res.status, detail);
    return { ok: false, error: `Resend ${res.status}` };
  }

  return { ok: true };
}
