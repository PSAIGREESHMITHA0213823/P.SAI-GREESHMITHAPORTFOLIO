import { useState } from 'react';
import { config, PLACEHOLDER } from '../data/config';
import { projectTypes, services } from '../data/services';

import { Icon, type IconName } from '../components/Icon';
import { ModuleHead, Placeholder, StatusBadge } from '../components/Primitives';
import { useGoToSection } from '../hooks/useGoToSection';
import { copyText } from '../utils/clipboard';
import { cn } from '../utils/cn';

/* ---------- Services ---------- */

export function Services() {
  const go = useGoToSection();
  return (
    <section className="module services" id="services" aria-labelledby="services-title">
      <div className="container">
        <ModuleHead
          index="11"
          label="Services"
          title={
            <>
              Have a software idea? <em>Let&rsquo;s build it.</em>
            </>
          }
          id="services-title"
        />
        <ol className="services__list">
          {services.map((s, i) => (
            <li key={s.id} className="services__item">
              <button
                type="button"
                className="services__row"
                onClick={() => go(s.filter ? 'projects' : 'contact', s.filter ? `?${s.filter}` : undefined)}
                aria-label={`${s.title}. ${s.summary} ${s.filter ? 'See related projects' : 'Start a conversation'}`}
              >
                <span className="services__num t-meta">{String(i + 1).padStart(2, '0')}</span>
                <span className="services__title">{s.title}</span>
                <span className="services__more">
                  <span className="t-body">{s.summary}</span>
                  <span className="services__link t-meta">
                    {s.filter ? 'Related projects' : 'Start a conversation'} <Icon name="arrowRight" size={12} />
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- Final CTA ---------- */

export function FinalCTA() {
  const go = useGoToSection();
  return (
    <section className="cta" aria-labelledby="cta-title">
      <div className="cta__grid" aria-hidden="true" />
      <div className="container cta__inner">
        <span className="t-meta">Next step</span>
        <h2 className="t-display cta__title" id="cta-title">
          Have a project in mind?
        </h2>
        <p className="t-body cta__text">
          Tell me what you&rsquo;re trying to build. I&rsquo;ll help turn the idea into a practical software solution.
        </p>
        <div className="cta__btns">
          <button type="button" className="btn btn--primary btn--lg" onClick={() => go('contact')}>
            Start a Conversation
            <Icon name="arrowRight" size={16} />
          </button>
          <button type="button" className="btn btn--ghost btn--lg" onClick={() => go('projects')}>
            View My Work
          </button>
        </div>
        <p className="t-meta cta__line">Websites · SaaS · AI · Business Software · Healthcare · Education</p>
      </div>
    </section>
  );
}

/* ---------- Contact ---------- */

interface FormState {
  name: string;
  email: string;
  projectType: string;
  budget: string;
  message: string;
  website: string; // honeypot
}

const EMPTY: FormState = { name: '', email: '', projectType: '', budget: '', message: '', website: '' };

function validate(f: FormState): Partial<Record<keyof FormState, string>> {
  const e: Partial<Record<keyof FormState, string>> = {};
  if (f.name.trim().length < 2) e.name = 'Please enter your name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = 'Please enter a valid email address.';
  if (!f.projectType) e.projectType = 'Choose the closest project type.';
  if (f.message.trim().length < 20) e.message = 'A couple of sentences helps — at least 20 characters.';
  return e;
}

function ContactRow({ icon, label, value, href, copy }: { icon: IconName; label: string; value: string | null; href?: string | null; copy?: boolean }) {
  return (
    <li className="contact__row">
      <Icon name={icon} size={16} />
      <span className="t-meta">{label}</span>
      {value ? (
        href ? (
          <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="contact__value">
            {value}
          </a>
        ) : (
          <span className="contact__value">{value}</span>
        )
      ) : (
        <Placeholder label={PLACEHOLDER.config} />
      )}
      {copy && value && (
        <button type="button" className="icon-btn icon-btn--sm" onClick={() => copyText(value, 'Email copied')} aria-label="Copy email">
          <Icon name="copy" size={14} />
        </button>
      )}
    </li>
  );
}

export function Contact() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'mailto' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const errors = validate(form);

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));
  const blur = (k: keyof FormState) => () => setTouched((t) => ({ ...t, [k]: true }));
  const show = (k: keyof FormState) => (touched[k] ? errors[k] : undefined);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched({ name: true, email: true, projectType: true, message: true });
    if (Object.keys(errors).length) {
      const first = (['name', 'email', 'projectType', 'message'] as const).find((k) => errors[k]);
      if (first) document.getElementById(`f-${first}`)?.focus();
      return;
    }
    // Honeypot filled → pretend success, send nothing.
    if (form.website) {
      setStatus('sent');
      return;
    }
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      projectType: form.projectType,
      budget: form.budget.trim() || null,
      message: form.message.trim(),
    };
    // Netlify Forms: the static form in index.html registers "project-inquiry" at deploy time;
    // Netlify stores each submission and emails it to the owner. Only exists on the deployed site.
    if (config.netlifyForm && !import.meta.env.DEV) {
      setStatus('sending');
      try {
        const res = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            'form-name': config.netlifyForm,
            name: payload.name,
            email: payload.email,
            projectType: payload.projectType,
            budget: payload.budget ?? '',
            message: payload.message,
            website: form.website,
          }).toString(),
        });
        if (!res.ok) throw new Error(String(res.status));
        setStatus('sent');
        setForm(EMPTY);
        setTouched({});
      } catch {
        setStatus('error');
        setErrorMsg(`The inquiry could not be sent. Please try again, or email ${config.email ?? 'me'} directly.`);
      }
      return;
    }
    if (config.formEndpoint) {
      setStatus('sending');
      try {
        const res = await fetch(config.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(String(res.status));
        setStatus('sent');
        setForm(EMPTY);
        setTouched({});
      } catch {
        setStatus('error');
        setErrorMsg('The inquiry could not be sent. Please try again, or use the email address listed.');
      }
      return;
    }
    if (config.email) {
      const body = `${payload.message}\n\nProject type: ${payload.projectType}\nBudget: ${payload.budget ?? 'Not specified'}\n\n${payload.name}\n${payload.email}`;
      window.location.href = `mailto:${config.email}?subject=${encodeURIComponent(`Project inquiry: ${payload.projectType}`)}&body=${encodeURIComponent(body)}`;
      setStatus('mailto');
      return;
    }
    setStatus('error');
    setErrorMsg('The inquiry form isn’t connected yet. [ SET formEndpoint OR email IN CONFIG ]');
  };

  return (
    <section className="module contact" id="contact" aria-labelledby="contact-title">
      <div className="container contact__grid">
        <div className="contact__side">
          <ModuleHead index="12" label="Contact" title={<>Let’s <em>talk.</em></>} id="contact-title" />
          <StatusBadge />
          <ul className="contact__list">
            <ContactRow icon="mail" label="Email" value={config.email} href={config.email ? `mailto:${config.email}` : null} copy />
            <ContactRow icon="phone" label="Phone" value={config.phone} href={config.phone ? `tel:${config.phone.replace(/\s/g, '')}` : null} />
            <ContactRow icon="linkedin" label="LinkedIn" value={config.linkedinUrl ? 'Profile' : null} href={config.linkedinUrl} />
            <ContactRow icon="github" label="GitHub" value={config.githubUrl ? 'Profile' : null} href={config.githubUrl} />
            <ContactRow icon="pin" label="Location" value={config.location} />
          </ul>
        </div>

        {status === 'sent' || status === 'mailto' ? (
          <div className="contact__success" role="status" tabIndex={-1} ref={(el) => el?.focus()}>
            <span className="contact__success-icon">
              <Icon name="check" size={20} />
            </span>
            <h3 className="t-title">{status === 'sent' ? 'Inquiry sent.' : 'Your email app should now be open.'}</h3>
            <p className="t-body">
              {status === 'sent'
                ? 'Thanks — I’ll read it properly and reply by email.'
                : 'The message is pre-filled. Send it from there and I’ll reply by email.'}
            </p>
            <button type="button" className="btn btn--ghost" onClick={() => setStatus('idle')}>
              Send another inquiry
            </button>
          </div>
        ) : (
          <form className="form" onSubmit={onSubmit} noValidate aria-describedby="form-note">
            <p id="form-note" className="t-meta form__note">
              Only what&rsquo;s needed to reply. Fields marked * are required.
            </p>
            <div className="form__row">
              <Field id="name" label="Name *" error={show('name')}>
                <input id="f-name" value={form.name} onChange={set('name')} onBlur={blur('name')} autoComplete="name" aria-invalid={!!show('name')} aria-describedby={show('name') ? 'e-name' : undefined} />
              </Field>
              <Field id="email" label="Email *" error={show('email')}>
                <input id="f-email" type="email" value={form.email} onChange={set('email')} onBlur={blur('email')} autoComplete="email" aria-invalid={!!show('email')} aria-describedby={show('email') ? 'e-email' : undefined} />
              </Field>
            </div>
            <div className="form__row">
              <Field id="projectType" label="Project type *" error={show('projectType')}>
                <select id="f-projectType" value={form.projectType} onChange={set('projectType')} onBlur={blur('projectType')} aria-invalid={!!show('projectType')} aria-describedby={show('projectType') ? 'e-projectType' : undefined}>
                  <option value="">Select…</option>
                  {projectTypes.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </Field>
              <Field id="budget" label="Budget (optional)">
                <input id="f-budget" value={form.budget} onChange={set('budget')} placeholder="A range, or “not sure yet”" />
              </Field>
            </div>
            <Field id="message" label="Message *" error={show('message')}>
              <textarea id="f-message" rows={6} value={form.message} onChange={set('message')} onBlur={blur('message')} placeholder="What are you trying to build, and who is it for?" aria-invalid={!!show('message')} aria-describedby={show('message') ? 'e-message' : undefined} />
            </Field>
            {/* Honeypot: hidden from people and assistive tech, bots fill it. */}
            <div className="form__hp" aria-hidden="true">
              <label>
                Website
                <input tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} />
              </label>
            </div>
            {status === 'error' && (
              <p className="form__error-banner" role="alert">
                {errorMsg}
              </p>
            )}
            <div className="form__foot">
              <button type="submit" className="btn btn--primary" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Send Project Inquiry'}
                <Icon name="send" size={16} />
              </button>
              <span className="t-meta">Replies come by email</span>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className={cn('field', error && 'has-error')}>
      <label htmlFor={`f-${id}`} className="t-meta">
        {label}
      </label>
      {children}
      {error && (
        <span className="field__error" id={`e-${id}`}>
          {error}
        </span>
      )}
    </div>
  );
}
