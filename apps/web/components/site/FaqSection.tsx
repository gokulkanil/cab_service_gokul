import type { Faq, SiteSettings } from '@wcs/shared';
import { telHref } from '@/lib/format';
import { revealDelay } from './css';

export function FaqSection({ faqs, settings }: { faqs: Faq[]; settings: SiteSettings }) {
  if (!faqs.length) return null;
  return (
    <section className="section faq" id="faq">
      <div className="container faq-grid">
        <div className="section-head reveal">
          <p className="eyebrow">FAQ</p>
          <h2 className="display">
            Questions, <em>answered.</em>
          </h2>
          <p>Can&apos;t find what you&apos;re looking for? Call or message us. We&apos;re happy to help.</p>
          <a className="btn btn-dark" href={telHref(settings.phoneE164)}>
            Call {settings.phoneDisplay}
          </a>
        </div>
        <div className="faq-list reveal" style={revealDelay(1)}>
          {faqs.map((f, i) => (
            <details key={f.question} open={i === 0}>
              <summary>{f.question}</summary>
              <p>{f.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
