import type { Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#10291b',
};

// Runs before the page paints: enables JS styles and picks the hero sky from the visitor's local time.
const prePaintScript = `
document.documentElement.classList.add('js');
(function () {
  var h = new Date().getHours();
  document.documentElement.dataset.time =
    h >= 5 && h < 10 ? 'dawn' : h >= 10 && h < 16 ? 'day' : h >= 16 && h < 19 ? 'dusk' : 'night';
})();
`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // The pre-paint script changes <html> attributes before React hydrates.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: prePaintScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..600&family=Manrope:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
