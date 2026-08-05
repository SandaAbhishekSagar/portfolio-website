import { useEffect, useState, type FormEvent } from 'react';
import Section from '../components/Section';
import InView from '../components/motion/InView';
import Magnetic from '../components/motion/Magnetic';
import Spotlight from '../components/motion/Spotlight';
import { PROFILE, TOOLCHAIN_DEFAULTS } from '../data/record';
import { getContent, sendContact, type Skill } from '../lib/api';

/** Shown in prerendered HTML until /api/content answers with the live rows. */
const FALLBACK_SKILLS: Skill[] = TOOLCHAIN_DEFAULTS.map((s, i) => ({
  id: i + 1,
  name: s.name,
  group_name: s.group_name,
  sort: i + 1,
}));

export default function Contact() {
  const [skills, setSkills] = useState<Skill[]>(FALLBACK_SKILLS);
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    getContent()
      .then((d) => {
        if (d.skills?.length) setSkills(d.skills);
      })
      .catch(() => {
        /* keep FALLBACK_SKILLS — never flash "loading…" in prerender */
      });
  }, []);

  const groups = Array.from(new Set(skills.map((s) => s.group_name)));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (form.name.trim().length < 2) next.name = 'Your name, please.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) next.email = 'A valid work email.';
    if (form.message.trim().length < 10) next.message = 'A line or two about the role.';
    setErrors(next);
    if (Object.keys(next).length) return;

    setStatus('sending');
    try {
      await sendContact(form);
      setStatus('sent');
      setForm({ name: '', email: '', company: '', message: '' });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Could not send.');
      setStatus('error');
    }
  };

  const field =
    'w-full rounded-md border bg-void px-4 py-3 text-[0.9375rem] text-bone placeholder:text-bone-dim/45 focus:outline-none';

  return (
    <Section id="contact" index="08" label="Contact">
      <div className="pb-16">
        <InView>
          <h3 className="u-display mb-12 max-w-[20ch] text-[1.75rem] text-bone sm:text-[2.5rem]">
            Hiring for voice or retrieval? Start here.
          </h3>
        </InView>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-xl border border-bone/12 bg-void-lift/85 p-7">
            <p className="u-mono mb-6 text-latent">Toolchain</p>
            <dl className="space-y-6">
              {groups.map((g) => (
                <div key={g}>
                  <dt className="u-mono text-bone-dim/70">{g}</dt>
                  <dd className="mt-2 flex flex-wrap gap-2">
                    {skills
                      .filter((s) => s.group_name === g)
                      .map((s) => (
                        <span
                          key={s.id}
                          className="rounded-[3px] border border-bone/14 px-2.5 py-1 font-mono text-[0.8125rem] tracking-[0.04em] text-bone"
                        >
                          {s.name}
                        </span>
                      ))}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 space-y-3 border-t border-bone/10 pt-6">
              <p className="u-mono text-bone-dim/70">Education</p>
              <p className="text-[0.9375rem] text-bone-dim">
                MS, Information Systems - Northeastern University, Boston.
                Graduated December 2025.
              </p>
              <p className="u-mono pt-3 text-bone-dim/70">Elsewhere</p>
              <ul className="flex flex-wrap gap-4">
                <li>
                  <a
                    className="u-mono text-bone underline decoration-bone/25 underline-offset-4 hover:text-ember"
                    href="https://github.com/SandaAbhishekSagar"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    GitHub ↗
                  </a>
                </li>
                <li>
                  <a
                    className="u-mono text-bone underline decoration-bone/25 underline-offset-4 hover:text-ember"
                    href="https://www.linkedin.com/in/sandaabhisheksagar"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    LinkedIn ↗
                  </a>
                </li>
                <li>
                  <a
                    className="u-mono text-bone underline decoration-bone/25 underline-offset-4 hover:text-ember"
                    href={`mailto:${PROFILE.email}`}
                  >
                    {PROFILE.email}
                  </a>
                </li>
                <li>
                  <a
                    className="u-mono text-bone underline decoration-bone/25 underline-offset-4 hover:text-ember"
                    href={PROFILE.resumePdf}
                    download
                  >
                    Resume PDF ↓
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl border border-amber/25 bg-gradient-to-br from-amber/10 to-transparent p-7">
            <Spotlight size={340} className="bg-amber/14" />
            <div className="relative">
              <p className="u-mono mb-2 text-amber">Book a call</p>
              <p className="mb-6 max-w-[44ch] text-[0.9375rem] text-bone-dim">
                Hiring for voice, retrieval, or applied AI product work at a
                Series A–C team? Send the role and a time window. Replies within
                one business day.
              </p>

              {status === 'sent' ? (
                <p
                  role="status"
                  className="u-mono rounded-md border border-amber/40 bg-amber/12 p-5 text-amber"
                >
                  Received. He will reply to your inbox within one business day.
                </p>
              ) : (
                <form onSubmit={submit} noValidate className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="c-name" className="u-mono mb-2 block text-bone-dim/70">
                        Name
                      </label>
                      <input
                        id="c-name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? 'e-name' : undefined}
                        className={`${field} ${errors.name ? 'border-ember' : 'border-bone/15 focus:border-amber'}`}
                      />
                      {errors.name && (
                        <p id="e-name" className="u-mono mt-2 text-ember">
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="c-email" className="u-mono mb-2 block text-bone-dim/70">
                        Work email
                      </label>
                      <input
                        id="c-email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'e-email' : undefined}
                        className={`${field} ${errors.email ? 'border-ember' : 'border-bone/15 focus:border-amber'}`}
                      />
                      {errors.email && (
                        <p id="e-email" className="u-mono mt-2 text-ember">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="c-company" className="u-mono mb-2 block text-bone-dim/70">
                      Company (optional)
                    </label>
                    <input
                      id="c-company"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className={`${field} border-bone/15 focus:border-amber`}
                    />
                  </div>
                  <div>
                    <label htmlFor="c-message" className="u-mono mb-2 block text-bone-dim/70">
                      The role
                    </label>
                    <textarea
                      id="c-message"
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? 'e-message' : undefined}
                      className={`${field} resize-none ${errors.message ? 'border-ember' : 'border-bone/15 focus:border-amber'}`}
                    />
                    {errors.message && (
                      <p id="e-message" className="u-mono mt-2 text-ember">
                        {errors.message}
                      </p>
                    )}
                  </div>
                  {status === 'error' && (
                    <p role="alert" className="u-mono text-ember">
                      {serverError}
                    </p>
                  )}
                  <Magnetic intensity={0.22} range={90}>
                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="u-mono rounded-md bg-amber px-8 py-3 text-void disabled:opacity-55"
                    >
                      {status === 'sending' ? 'sending…' : 'send →'}
                    </button>
                  </Magnetic>
                </form>
              )}
            </div>
          </div>
        </div>

        <footer className="mt-16 border-t border-bone/10 pt-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="u-mono text-bone-dim/60">
              Abhishek Sagar Sanda · Boston, MA · abhisheksagarsanda.com
            </p>
            <a href="#top" className="u-mono text-bone-dim/60 hover:text-ember">
              Back to top ↑
            </a>
          </div>
        </footer>
      </div>
    </Section>
  );
}
