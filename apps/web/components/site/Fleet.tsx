import { fleetStageSvg } from '@/components/art/fleetStageSvg';
import type { Vehicle } from '@wcs/shared';
import { mediaUrl, vehicleName, vehicleSpecs } from '@/lib/format';
import { revealDelay } from './css';

export function Fleet({ vehicle }: { vehicle: Vehicle }) {
  const name = vehicleName(vehicle);

  return (
    <section className="section fleet" id="fleet">
      <div className="container fleet-grid">
        <div className="fleet-stage reveal">
          <div className="stage-art" aria-hidden="true" dangerouslySetInnerHTML={{ __html: fleetStageSvg }} />
          {/* An uploaded photo covers the illustration */}
          {vehicle.imagePath ? (
            <div className="photo" style={{ backgroundImage: `url('${mediaUrl(vehicle.imagePath)}')` }}></div>
          ) : null}
          <span className="stage-tag">
            {name} · {vehicle.categoryName}
          </span>
        </div>

        <div className="fleet-info reveal" style={revealDelay(1)}>
          <p className="eyebrow">Our cab</p>
          <h2 className="display">
            The {name}. {vehicle.tagline ? <em>{vehicle.tagline}</em> : null}
          </h2>
          {vehicle.description ? <p className="fleet-lead">{vehicle.description}</p> : null}
          <dl className="specs">
            {vehicleSpecs(vehicle).map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
          <p className="note">Travelling as a bigger group? Call us and we&apos;ll help you plan it.</p>
        </div>
      </div>
    </section>
  );
}
