/** "Wayanad Cab Service" shown as "<strong>Wayanad</strong> Cab Service", the brand style. */
export function BusinessName({ name }: { name: string }) {
  const [first, ...rest] = name.split(' ');
  return (
    <span className="brand-text">
      <strong>{first}</strong>
      {rest.length ? ` ${rest.join(' ')}` : null}
    </span>
  );
}
