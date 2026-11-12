import type { Feature } from '@wcs/shared';
import { revealDelay } from './css';
import { ContentIcon } from './icons';

export function WhyUs({ features }: { features: Feature[] }) {
  if (!features.length) return null;
  return (
    <section className="section why" id="why">
      <div className="container">
        <div className="section-head reveal">
          <p className="eyebrow">Why travellers choose us</p>
          <h2 className="display">
            Small details that make <em>a big difference.</em>
          </h2>
        </div>
        <div className="why-grid">
          {features.map((f, i) => (
            <div key={f.title} className="why-item reveal" style={revealDelay(i % 3)}>
              <div className="icon">
                <ContentIcon name={f.icon} />
              </div>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
