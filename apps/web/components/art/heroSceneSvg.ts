// Illustrated hills, mist, tea rows and the cab driving along the road (hero).
// Copied unchanged from the original static page; static markup with no user data.

export const heroSceneSvg = `
<svg viewBox="0 0 1440 420" preserveAspectRatio="xMidYMax slice">
<defs>
<filter id="soft" x="-20%" y="-150%" width="140%" height="400%"><feGaussianBlur stdDeviation="14"/></filter>
<linearGradient id="beamGrad" x1="0" x2="1" y1="0" y2="0">
  <stop offset="0" stop-color="#fff6c8" stop-opacity=".85"/>
  <stop offset="1" stop-color="#fff6c8" stop-opacity="0"/>
</linearGradient>
<symbol id="oak" viewBox="0 0 20 70"><rect x="9.2" y="22" width="1.6" height="48"/><ellipse cx="10" cy="20" rx="5.5" ry="20"/></symbol>
</defs>

<g class="birds">
<path d="M0 30 q6 -6 12 0 q6 -6 12 0"/>
<path d="M34 18 q5 -5 10 0 q5 -5 10 0"/>
<path d="M60 36 q4 -4 8 0 q4 -4 8 0"/>
</g>

<g class="layer" data-depth="0.28">
<path class="hill-1" d="M0 112 C 140 75 260 52 380 71 S 600 30 740 56 S 980 22 1120 52 S 1340 38 1440 68 V420 H0Z"/>
</g>

<g class="mist-band m1"><rect class="mist" x="-120" y="70" width="980" height="34" rx="17" filter="url(#soft)"/></g>

<g class="layer" data-depth="0.16">
<path class="hill-2" d="M0 172 C 180 128 320 120 470 150 S 760 105 920 142 S 1190 112 1330 142 S 1420 139 1440 142 V420 H0Z"/>
<g class="trees-2">
  <use href="#oak" x="196" y="98" width="12" height="42"/>
  <use href="#oak" x="214" y="104" width="10" height="36"/>
  <use href="#oak" x="430" y="106" width="12" height="42"/>
  <use href="#oak" x="876" y="98" width="12" height="42"/>
  <use href="#oak" x="1250" y="90" width="12" height="42"/>
  <use href="#oak" x="1268" y="96" width="10" height="36"/>
</g>
</g>

<g class="mist-band m2"><rect class="mist" x="560" y="140" width="1040" height="40" rx="20" filter="url(#soft)"/></g>

<g class="layer" data-depth="0.07">
<path class="hill-3" d="M0 240 C 220 202 400 210 580 232 S 930 188 1120 225 S 1380 210 1440 221 V420 H0Z"/>
<g class="tea">
  <path d="M0 258 C 220 220 400 228 580 250 S 930 206 1120 243 S 1380 228 1440 239"/>
  <path d="M0 274 C 220 236 400 244 580 266 S 930 222 1120 259 S 1380 244 1440 255"/>
  <path d="M0 290 C 220 252 400 260 580 282 S 930 238 1120 275 S 1380 260 1440 271"/>
</g>
<g class="trees-3">
  <use href="#oak" x="292" y="160" width="16" height="56"/>
  <use href="#oak" x="700" y="182" width="16" height="56"/>
  <use href="#oak" x="994" y="152" width="16" height="56"/>
  <use href="#oak" x="1354" y="164" width="16" height="56"/>
</g>
</g>

<g class="mist-band m3"><rect class="mist" x="-200" y="226" width="900" height="36" rx="18" filter="url(#soft)"/></g>

<g class="layer front">
<path class="hill-4" d="M0 308 C 260 276 540 284 780 298 S 1220 274 1440 291 V420 H0Z"/>
<path id="heroRoad" class="road-edge" d="M-200 390 C 120 352 380 369 640 352 S 1060 328 1280 346 S 1560 369 1700 352"/>
<path class="road" d="M-200 390 C 120 352 380 369 640 352 S 1060 328 1280 346 S 1560 369 1700 352"/>
<path class="road-line" d="M-200 390 C 120 352 380 369 640 352 S 1060 328 1280 346 S 1560 369 1700 352"/>

<g class="bushes">
  <ellipse cx="90" cy="414" rx="70" ry="16"/>
  <ellipse cx="520" cy="404" rx="90" ry="18"/>
  <ellipse cx="980" cy="398" rx="110" ry="20"/>
  <ellipse cx="1350" cy="408" rx="90" ry="18"/>
</g>

<g class="fireflies">
  <circle cx="160" cy="300" r="2.2" style="--fd:0s"/>
  <circle cx="420" cy="292" r="1.8" style="--fd:1.2s"/>
  <circle cx="610" cy="312" r="2.2" style="--fd:.6s"/>
  <circle cx="860" cy="286" r="1.8" style="--fd:2s"/>
  <circle cx="1080" cy="300" r="2.2" style="--fd:1.6s"/>
  <circle cx="1300" cy="284" r="1.8" style="--fd:.3s"/>
</g>

<!-- The cab: side view of a white Toyota Etios -->
<g id="heroCab">
  <animateMotion id="heroCabMotion" dur="16s" repeatCount="indefinite" rotate="auto">
    <mpath href="#heroRoad"/>
  </animateMotion>
  <g transform="translate(-50 -29) scale(.5)">
    <path class="beam" d="M192 41 L310 22 L310 66 Z" fill="url(#beamGrad)"/>
    <ellipse cx="100" cy="66" rx="92" ry="4" fill="rgba(0,0,0,.25)"/>
    <path d="M10 52 C6 50 5 44 6 40 L8 34 C9 31 12 30 16 30 L46 29 L64 14 C66 12.5 68 12 71 12 L116 12 C120 12 123 13 126 15 L148 30 L180 34 C188 35 194 39 195 45 L196 50 C196 52 194 53 192 53 L172 53 A16 16 0 0 0 140 53 L64 53 A16 16 0 0 0 32 53 Z" fill="#f8f8f5" stroke="#c4c7c1" stroke-width="1"/>
    <path d="M50 30 L66 16 C67.5 15 69 14.6 71 14.6 L98 14.6 L98 30 Z" fill="#2b3a43"/>
    <path d="M102 14.6 L116 14.6 C119 14.6 121 15.4 123 17 L141 30 L102 30 Z" fill="#2b3a43"/>
    <path d="M70 18 L80 18 L72 27 Z" fill="rgba(255,255,255,.18)"/>
    <rect x="14" y="36" width="172" height="2.2" fill="#d9a441"/>
    <path d="M100 31 V50 M142 31 L140 50 M57 31 L60 50" stroke="#d6d8d3" stroke-width="1"/>
    <rect x="86" y="40" width="7" height="1.8" rx=".9" fill="#b9bcb6"/>
    <rect x="128" y="40" width="7" height="1.8" rx=".9" fill="#b9bcb6"/>
    <path d="M141 27.5 L147 26.5 L147.5 31 L142 31 Z" fill="#e4e5e1"/>
    <path d="M184 38.5 L194 41.5 L193.5 44.5 L184 42.5 Z" fill="#fff3c4"/>
    <rect x="6" y="34.5" width="5" height="6" rx="1.5" fill="#c0392b"/>
    <path d="M174 50.5 H195" stroke="#9aa0a0" stroke-width="2"/>
    <g transform="translate(48 53)"><circle r="12" fill="#1b1f1e"/><circle r="7" fill="#bfc4c3"/><path class="spokes" d="M0-7V7M-7 0H7M-5-5L5 5M-5 5L5-5" stroke="#7d8584" stroke-width="1.6"/><circle r="2" fill="#555"/></g>
    <g transform="translate(156 53)"><circle r="12" fill="#1b1f1e"/><circle r="7" fill="#bfc4c3"/><path class="spokes" d="M0-7V7M-7 0H7M-5-5L5 5M-5 5L5-5" stroke="#7d8584" stroke-width="1.6"/><circle r="2" fill="#555"/></g>
  </g>
</g>
</g>
</svg>
`;
