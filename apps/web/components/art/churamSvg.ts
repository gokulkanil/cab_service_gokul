// Thamarassery Churam: nine hairpins; the cab is moved along the road by PageEffects on scroll.
// Copied unchanged from the original static page; static markup with no user data.

export const churamSvg = `
<svg class="churam" viewBox="0 30 400 790" role="img" aria-labelledby="churamTitle">
  <title id="churamTitle">The nine hairpin bends of Thamarassery Churam, from Adivaram up to Lakkidi</title>
  <defs>
    <pattern id="leafDots" width="22" height="22" patternUnits="userSpaceOnUse">
      <circle cx="5" cy="6" r="2.2" fill="rgba(169,195,160,.10)"/>
      <circle cx="16" cy="16" r="1.6" fill="rgba(169,195,160,.07)"/>
    </pattern>
    <linearGradient id="beam2" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="#fff3c4" stop-opacity=".55"/>
      <stop offset="1" stop-color="#fff3c4" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect x="0" y="30" width="400" height="790" fill="url(#leafDots)"/>

  <g class="churam-trees">
    <circle cx="322" cy="726" r="9"/><circle cx="78" cy="650" r="9"/><circle cx="322" cy="574" r="9"/>
    <circle cx="78" cy="498" r="9"/><circle cx="322" cy="422" r="9"/><circle cx="78" cy="346" r="9"/>
    <circle cx="322" cy="270" r="9"/><circle cx="78" cy="194" r="9"/><circle cx="322" cy="118" r="9"/>
    <circle cx="22" cy="720" r="12"/><circle cx="40" cy="566" r="10"/><circle cx="18" cy="420" r="13"/>
    <circle cx="30" cy="270" r="11"/><circle cx="380" cy="640" r="11"/><circle cx="372" cy="500" r="9"/>
    <circle cx="384" cy="340" r="12"/><circle cx="376" cy="190" r="10"/><circle cx="200" cy="808" r="10"/>
    <circle cx="300" cy="806" r="8"/><circle cx="380" cy="60" r="10"/>
  </g>

  <path class="road-edge" d="M20 780 L330 756 A30 30 0 0 0 330 696 L70 680 A30 30 0 0 1 70 620 L330 604 A30 30 0 0 0 330 544 L70 528 A30 30 0 0 1 70 468 L330 452 A30 30 0 0 0 330 392 L70 376 A30 30 0 0 1 70 316 L330 300 A30 30 0 0 0 330 240 L70 224 A30 30 0 0 1 70 164 L330 148 A30 30 0 0 0 330 88 L50 68"/>
  <path id="churamRoad" class="road" d="M20 780 L330 756 A30 30 0 0 0 330 696 L70 680 A30 30 0 0 1 70 620 L330 604 A30 30 0 0 0 330 544 L70 528 A30 30 0 0 1 70 468 L330 452 A30 30 0 0 0 330 392 L70 376 A30 30 0 0 1 70 316 L330 300 A30 30 0 0 0 330 240 L70 224 A30 30 0 0 1 70 164 L330 148 A30 30 0 0 0 330 88 L50 68"/>
  <path class="road-dash" d="M20 780 L330 756 A30 30 0 0 0 330 696 L70 680 A30 30 0 0 1 70 620 L330 604 A30 30 0 0 0 330 544 L70 528 A30 30 0 0 1 70 468 L330 452 A30 30 0 0 0 330 392 L70 376 A30 30 0 0 1 70 316 L330 300 A30 30 0 0 0 330 240 L70 224 A30 30 0 0 1 70 164 L330 148 A30 30 0 0 0 330 88 L50 68"/>
  <path id="churamTrail" class="road-trail" d="M20 780 L330 756 A30 30 0 0 0 330 696 L70 680 A30 30 0 0 1 70 620 L330 604 A30 30 0 0 0 330 544 L70 528 A30 30 0 0 1 70 468 L330 452 A30 30 0 0 0 330 392 L70 376 A30 30 0 0 1 70 316 L330 300 A30 30 0 0 0 330 240 L70 224 A30 30 0 0 1 70 164 L330 148 A30 30 0 0 0 330 88 L50 68"/>

  <g class="hp-labels">
    <g class="hp"><circle cx="386" cy="726" r="9"/><text x="386" y="729.5">1</text></g>
    <g class="hp"><circle cx="14" cy="650" r="9"/><text x="14" y="653.5">2</text></g>
    <g class="hp"><circle cx="386" cy="574" r="9"/><text x="386" y="577.5">3</text></g>
    <g class="hp"><circle cx="14" cy="498" r="9"/><text x="14" y="501.5">4</text></g>
    <g class="hp"><circle cx="386" cy="422" r="9"/><text x="386" y="425.5">5</text></g>
    <g class="hp"><circle cx="14" cy="346" r="9"/><text x="14" y="349.5">6</text></g>
    <g class="hp"><circle cx="386" cy="270" r="9"/><text x="386" y="273.5">7</text></g>
    <g class="hp"><circle cx="14" cy="194" r="9"/><text x="14" y="197.5">8</text></g>
    <g class="hp"><circle cx="386" cy="118" r="9"/><text x="386" y="121.5">9</text></g>
  </g>

  <g class="place place-start"><circle cx="20" cy="780" r="5"/><text x="34" y="806">Adivaram</text></g>
  <g class="place place-end"><circle class="flag" cx="50" cy="68" r="6"/><text x="66" y="50">Lakkidi viewpoint</text></g>

  <!-- Top-down view of the cab; JS moves it along the road as you scroll -->
  <g id="churamCab" transform="translate(20 780)">
    <path d="M17 -5 L62 -20 L62 20 L17 5 Z" fill="url(#beam2)"/>
    <rect x="-18" y="-8.5" width="36" height="17" rx="5" fill="#f8f8f5"/>
    <rect x="-6.5" y="-7" width="12" height="14" rx="2.5" fill="#e3e4df"/>
    <path d="M5.5 -7 L10.5 -6.2 Q11.6 0 10.5 6.2 L5.5 7 Z" fill="#26343c"/>
    <path d="M-6.5 -7 L-10 -6.2 Q-10.9 0 -10 6.2 L-6.5 7 Z" fill="#26343c"/>
    <rect x="15.4" y="-7" width="2.3" height="3.2" rx="1" fill="#fff3c4"/>
    <rect x="15.4" y="3.8" width="2.3" height="3.2" rx="1" fill="#fff3c4"/>
    <rect x="-18" y="-7" width="1.8" height="3" fill="#d24b3a"/>
    <rect x="-18" y="4" width="1.8" height="3" fill="#d24b3a"/>
    <rect x="2" y="-10.5" width="3.2" height="2.2" rx="1" fill="#e3e4df"/>
    <rect x="2" y="8.3" width="3.2" height="2.2" rx="1" fill="#e3e4df"/>
  </g>
</svg>
`;
