// SVG icons. Content in the database refers to them by key (services.icon, features.icon).

import type { ReactNode } from 'react';

const line = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8 } as const;

const contentIcons: Record<string, ReactNode> = {
  plane: (
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="currentColor" />
  ),
  mountain: (
    <>
      <path d="M2.5 20 9 9.5l4 6 3-4 5.5 8.5z" {...line} strokeLinejoin="round" />
      <circle cx="17" cy="5.5" r="2.2" {...line} />
    </>
  ),
  route: (
    <>
      <path d="M4 20c4-8 12-4 16-15" {...line} strokeLinecap="round" strokeDasharray="2.5 3" />
      <circle cx="4" cy="20" r="2" fill="currentColor" />
      <path d="M20 2.5a3 3 0 0 0-3 3c0 2.2 3 5 3 5s3-2.8 3-5a3 3 0 0 0-3-3z" fill="currentColor" />
    </>
  ),
  home: (
    <>
      <path d="M3 11.5 12 4l9 7.5M5.5 9.5V20h13V9.5" {...line} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 20v-5h4v5" {...line} strokeLinejoin="round" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" {...line} />
      <path d="M12 7.5V12l3 2" {...line} strokeLinecap="round" />
    </>
  ),
  steering: (
    <>
      <circle cx="12" cy="12" r="8.5" {...line} />
      <circle cx="12" cy="12" r="2.2" fill="currentColor" />
      <path d="M3.8 10.5h5.9M14.3 10.5h5.9M12 14.2v6.2" stroke="currentColor" strokeWidth={1.8} />
    </>
  ),
  snowflake: (
    <path
      d="M12 2.5v19M3.8 7.2l16.4 9.6M3.8 16.8l16.4-9.6M9.5 4 12 6.5 14.5 4M9.5 20l2.5-2.5 2.5 2.5"
      {...line}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  tag: (
    <>
      <path d="M3.5 12.5 11 5h9v9l-7.5 7.5z" {...line} strokeLinejoin="round" />
      <circle cx="16" cy="9" r="1.6" fill="currentColor" />
    </>
  ),
  stopwatch: (
    <>
      <circle cx="12" cy="13" r="7.5" {...line} />
      <path d="M12 9.5V13l2.5 1.8M9.5 2.5h5" {...line} strokeLinecap="round" />
    </>
  ),
  moon: (
    <>
      <path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z" {...line} strokeLinejoin="round" />
      <path d="M17 3v4M15 5h4" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
    </>
  ),
  shield: (
    <>
      <path d="M12 2.8 4.5 5.8v5.7c0 4.6 3.2 8.4 7.5 9.7 4.3-1.3 7.5-5.1 7.5-9.7V5.8z" {...line} strokeLinejoin="round" />
      <path d="m8.8 12 2.3 2.3 4.2-4.4" {...line} strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  dot: <circle cx="12" cy="12" r="4" fill="currentColor" />,
};

/** Keys an admin can pick for a service or feature icon. */
export const iconKeys = Object.keys(contentIcons);

/** Icon by key; unknown keys fall back to a dot so a typo never breaks the page. */
export function ContentIcon({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {contentIcons[name] ?? contentIcons.dot}
    </svg>
  );
}

export function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"
        fill="currentColor"
      />
    </svg>
  );
}

export function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z" {...line} strokeLinejoin="round" />
      <path d="M8.5 10.5h7M8.5 13.5h4.5" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
    </svg>
  );
}

export function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.5a6.5 6.5 0 0 0-6.5 6.5c0 4.9 6.5 12.5 6.5 12.5s6.5-7.6 6.5-12.5A6.5 6.5 0 0 0 12 2.5z" fill="currentColor" />
    </svg>
  );
}

export function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d={direction === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BrandMark() {
  return (
    <svg className="brand-mark" viewBox="0 0 40 40" aria-hidden="true">
      <rect width="40" height="40" rx="12" fill="#10291b" />
      <path d="M4 30 L14 16.5 L20 23.5 L27 13.5 L36 30 Z" fill="#6f9b5a" />
      <path d="M5 34.5 C13 28 22 34.5 35 27" stroke="#d9a441" strokeWidth={3} fill="none" strokeLinecap="round" />
    </svg>
  );
}
