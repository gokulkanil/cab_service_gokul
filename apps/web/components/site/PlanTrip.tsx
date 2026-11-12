import type { DepartureBoard, TravelTip } from '@wcs/shared';
import { boardDuration, pad2 } from '@/lib/format';

type Props = { board: DepartureBoard | null; tips: TravelTip[] };

export function PlanTrip({ board, tips }: Props) {
  if (!board && !tips.length) return null;
  return (
    <section className="section plan" id="plan">
      <div className="container plan-grid">
        <div className="reveal">
          <div className="section-head">
            <p className="eyebrow">Plan your trip</p>
            <h2 className="display">
              How far is <em>everything?</em>
            </h2>
          </div>
          {board ? (
            <div className="board" id="board">
              <div className="board-head">
                <span>Departures · {board.originName}</span>
                <span className="board-clock">
                  <span className="live-dot" aria-hidden="true"></span>
                  <span id="istClock">--:--</span> IST
                </span>
              </div>
              {board.routes.map((r) => {
                const time = boardDuration(r.durationMinutes);
                return (
                  <div key={r.boardLabel} className="board-row">
                    <span className="to flap" data-text={r.boardLabel}>
                      {r.boardLabel}
                    </span>
                    <span className="via">{r.viaNote}</span>
                    <span className="time flap" data-text={time}>
                      {time}
                    </span>
                  </div>
                );
              })}
              <p className="board-note">
                Approximate drive times in normal conditions. Ghat traffic, rain and forest checkpost timings can change
                them.
              </p>
            </div>
          ) : null}
        </div>

        {tips.length ? (
          <div className="tips">
            <h3 className="tips-title reveal">Good to know before you go</h3>
            {tips.map((t, i) => (
              <div key={t.title} className="tip reveal">
                <span className="tip-num">{pad2(i + 1)}</span>
                <div>
                  <h4>{t.title}</h4>
                  <p>{t.body}</p>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
