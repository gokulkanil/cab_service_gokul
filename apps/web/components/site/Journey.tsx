import { churamSvg } from '@/components/art/churamSvg';

/** The Churam scroll story. Design copy tied to the animation, so it stays in code. */
export function Journey() {
  return (
    <section className="journey" id="journey" aria-label="Driving up Thamarassery Churam">
      <div className="journey-sticky">
        <div className="container journey-grid">
          <div className="journey-copy">
            <p className="eyebrow light">Thamarassery Churam · NH 766</p>
            <h2 className="display">
              Nine hairpins. <br />
              <em>Zero stress.</em>
            </h2>
            <p className="journey-lead">
              The ghat road from Adivaram up to Lakkidi is the main way into Wayanad. Our drivers take it every day:
              in mist, in monsoon rain and after dark.
            </p>

            <div className="bend-meter" aria-live="polite">
              <span className="bend-label">Hairpin</span>
              <span className="bend-count">
                <b id="bendNum">0</b>/9
              </span>
              <span className="bend-track">
                <span id="bendBar"></span>
              </span>
            </div>

            <ol className="journey-steps">
              <li className="journey-step active">
                <strong>Local drivers</strong> who know every bend by heart.
              </li>
              <li className="journey-step">
                <strong>Steady, unhurried driving</strong>, easy on anyone prone to motion sickness.
              </li>
              <li className="journey-step">
                <strong>Lakkidi viewpoint.</strong> Welcome to Wayanad.
              </li>
            </ol>
            <p className="scroll-hint">
              Scroll to drive up <span aria-hidden="true">↓</span>
            </p>
          </div>

          <div className="journey-visual" dangerouslySetInnerHTML={{ __html: churamSvg }} />
        </div>
      </div>
    </section>
  );
}
