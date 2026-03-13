import React from 'react';

function HeroSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 600 400"
      fill="none"
      aria-hidden="true"
      style={{width: '100%', maxWidth: 560, height: 'auto'}}>
      {/* Background glow */}
      <defs>
        <radialGradient id="heroGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3fb950" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#3fb950" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3fb950" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#3fb950" stopOpacity="0" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <ellipse cx="300" cy="200" rx="280" ry="180" fill="url(#heroGlow)" />

      {/* Grid floor perspective lines */}
      <g opacity="0.15" stroke="#3fb950" strokeWidth="0.5">
        <line x1="300" y1="160" x2="0" y2="400" />
        <line x1="300" y1="160" x2="100" y2="400" />
        <line x1="300" y1="160" x2="200" y2="400" />
        <line x1="300" y1="160" x2="300" y2="400" />
        <line x1="300" y1="160" x2="400" y2="400" />
        <line x1="300" y1="160" x2="500" y2="400" />
        <line x1="300" y1="160" x2="600" y2="400" />
        {/* Horizontal lines */}
        <line x1="80" y1="240" x2="520" y2="240" />
        <line x1="40" y1="280" x2="560" y2="280" />
        <line x1="0" y1="320" x2="600" y2="320" />
        <line x1="0" y1="360" x2="600" y2="360" />
      </g>

      {/* Central command terminal */}
      <g transform="translate(210, 60)">
        {/* Terminal window */}
        <rect
          x="0"
          y="0"
          width="180"
          height="120"
          rx="8"
          ry="8"
          fill="#161b22"
          stroke="#3fb950"
          strokeWidth="1.5"
          filter="url(#glow)"
        />
        {/* Title bar */}
        <rect
          x="0"
          y="0"
          width="180"
          height="24"
          rx="8"
          ry="0"
          fill="#21262d"
        />
        <rect x="0" y="8" width="180" height="16" fill="#21262d" />
        {/* Traffic lights */}
        <circle cx="16" cy="12" r="4" fill="#f85149" opacity="0.8" />
        <circle cx="30" cy="12" r="4" fill="#e3b341" opacity="0.8" />
        <circle cx="44" cy="12" r="4" fill="#3fb950" opacity="0.8" />
        {/* Terminal text */}
        <text
          x="12"
          y="44"
          fill="#3fb950"
          fontSize="10"
          fontFamily="monospace"
          opacity="0.9">
          $ protocol deploy:push
        </text>
        <text
          x="12"
          y="60"
          fill="#56d364"
          fontSize="10"
          fontFamily="monospace"
          opacity="0.7">
          v1.2.0
        </text>
        <text
          x="12"
          y="80"
          fill="#8b949e"
          fontSize="9"
          fontFamily="monospace"
          opacity="0.6">
          Pushing to 20 nodes...
        </text>
        <text
          x="12"
          y="96"
          fill="#3fb950"
          fontSize="9"
          fontFamily="monospace"
          opacity="0.8">
          ✓ All nodes deployed
        </text>
        <text
          x="12"
          y="110"
          fill="#3fb950"
          fontSize="10"
          fontFamily="monospace"
          className="terminal-cursor">
          █
        </text>
      </g>

      {/* Signal waves from terminal */}
      <g filter="url(#softGlow)">
        <circle
          cx="300"
          cy="120"
          r="30"
          fill="none"
          stroke="#3fb950"
          strokeWidth="0.8"
          opacity="0.3">
          <animate
            attributeName="r"
            values="30;80;130"
            dur="3s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.3;0.15;0"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>
        <circle
          cx="300"
          cy="120"
          r="30"
          fill="none"
          stroke="#3fb950"
          strokeWidth="0.8"
          opacity="0.3">
          <animate
            attributeName="r"
            values="30;80;130"
            dur="3s"
            begin="1s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.3;0.15;0"
            dur="3s"
            begin="1s"
            repeatCount="indefinite"
          />
        </circle>
        <circle
          cx="300"
          cy="120"
          r="30"
          fill="none"
          stroke="#3fb950"
          strokeWidth="0.8"
          opacity="0.3">
          <animate
            attributeName="r"
            values="30;80;130"
            dur="3s"
            begin="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.3;0.15;0"
            dur="3s"
            begin="2s"
            repeatCount="indefinite"
          />
        </circle>
      </g>

      {/* Server node - left top */}
      <g transform="translate(60, 180)">
        <ellipse cx="30" cy="30" rx="40" ry="40" fill="url(#nodeGlow)" />
        <rect
          x="5"
          y="8"
          width="50"
          height="44"
          rx="4"
          fill="#161b22"
          stroke="#3fb950"
          strokeWidth="1"
          opacity="0.9"
        />
        <rect x="10" y="14" width="40" height="8" rx="2" fill="#21262d" />
        <circle cx="42" cy="18" r="2.5" fill="#3fb950">
          <animate
            attributeName="opacity"
            values="1;0.4;1"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
        <rect x="10" y="26" width="40" height="8" rx="2" fill="#21262d" />
        <circle cx="42" cy="30" r="2.5" fill="#3fb950">
          <animate
            attributeName="opacity"
            values="1;0.4;1"
            dur="2s"
            begin="0.3s"
            repeatCount="indefinite"
          />
        </circle>
        <rect x="10" y="38" width="40" height="8" rx="2" fill="#21262d" />
        <circle cx="42" cy="42" r="2.5" fill="#3fb950">
          <animate
            attributeName="opacity"
            values="1;0.4;1"
            dur="2s"
            begin="0.6s"
            repeatCount="indefinite"
          />
        </circle>
        <text
          x="30"
          y="65"
          fill="#8b949e"
          fontSize="8"
          fontFamily="monospace"
          textAnchor="middle">
          node-01
        </text>
      </g>

      {/* Connection line to left node */}
      <line
        x1="210"
        y1="140"
        x2="110"
        y2="200"
        stroke="#3fb950"
        strokeWidth="0.8"
        opacity="0.4"
        strokeDasharray="4 3">
        <animate
          attributeName="strokeDashoffset"
          values="0;-7"
          dur="1s"
          repeatCount="indefinite"
        />
      </line>

      {/* Server node - right top */}
      <g transform="translate(470, 180)">
        <ellipse cx="30" cy="30" rx="40" ry="40" fill="url(#nodeGlow)" />
        <rect
          x="5"
          y="8"
          width="50"
          height="44"
          rx="4"
          fill="#161b22"
          stroke="#3fb950"
          strokeWidth="1"
          opacity="0.9"
        />
        <rect x="10" y="14" width="40" height="8" rx="2" fill="#21262d" />
        <circle cx="42" cy="18" r="2.5" fill="#3fb950">
          <animate
            attributeName="opacity"
            values="1;0.4;1"
            dur="2s"
            begin="0.5s"
            repeatCount="indefinite"
          />
        </circle>
        <rect x="10" y="26" width="40" height="8" rx="2" fill="#21262d" />
        <circle cx="42" cy="30" r="2.5" fill="#3fb950">
          <animate
            attributeName="opacity"
            values="1;0.4;1"
            dur="2s"
            begin="0.8s"
            repeatCount="indefinite"
          />
        </circle>
        <rect x="10" y="38" width="40" height="8" rx="2" fill="#21262d" />
        <circle cx="42" cy="42" r="2.5" fill="#3fb950">
          <animate
            attributeName="opacity"
            values="1;0.4;1"
            dur="2s"
            begin="1.1s"
            repeatCount="indefinite"
          />
        </circle>
        <text
          x="30"
          y="65"
          fill="#8b949e"
          fontSize="8"
          fontFamily="monospace"
          textAnchor="middle">
          node-02
        </text>
      </g>

      {/* Connection line to right node */}
      <line
        x1="390"
        y1="140"
        x2="490"
        y2="200"
        stroke="#3fb950"
        strokeWidth="0.8"
        opacity="0.4"
        strokeDasharray="4 3">
        <animate
          attributeName="strokeDashoffset"
          values="0;-7"
          dur="1s"
          repeatCount="indefinite"
        />
      </line>

      {/* Server node - left bottom */}
      <g transform="translate(130, 290)">
        <ellipse cx="30" cy="25" rx="40" ry="35" fill="url(#nodeGlow)" />
        <rect
          x="5"
          y="4"
          width="50"
          height="44"
          rx="4"
          fill="#161b22"
          stroke="#3fb950"
          strokeWidth="1"
          opacity="0.9"
        />
        <rect x="10" y="10" width="40" height="8" rx="2" fill="#21262d" />
        <circle cx="42" cy="14" r="2.5" fill="#3fb950">
          <animate
            attributeName="opacity"
            values="1;0.4;1"
            dur="2s"
            begin="1s"
            repeatCount="indefinite"
          />
        </circle>
        <rect x="10" y="22" width="40" height="8" rx="2" fill="#21262d" />
        <circle cx="42" cy="26" r="2.5" fill="#3fb950">
          <animate
            attributeName="opacity"
            values="1;0.4;1"
            dur="2s"
            begin="1.3s"
            repeatCount="indefinite"
          />
        </circle>
        <rect x="10" y="34" width="40" height="8" rx="2" fill="#21262d" />
        <circle cx="42" cy="38" r="2.5" fill="#3fb950">
          <animate
            attributeName="opacity"
            values="1;0.4;1"
            dur="2s"
            begin="1.6s"
            repeatCount="indefinite"
          />
        </circle>
        <text
          x="30"
          y="61"
          fill="#8b949e"
          fontSize="8"
          fontFamily="monospace"
          textAnchor="middle">
          node-03
        </text>
      </g>

      {/* Connection line to left bottom node */}
      <line
        x1="260"
        y1="180"
        x2="180"
        y2="300"
        stroke="#3fb950"
        strokeWidth="0.8"
        opacity="0.4"
        strokeDasharray="4 3">
        <animate
          attributeName="strokeDashoffset"
          values="0;-7"
          dur="1s"
          begin="0.3s"
          repeatCount="indefinite"
        />
      </line>

      {/* Server node - right bottom */}
      <g transform="translate(380, 290)">
        <ellipse cx="30" cy="25" rx="40" ry="35" fill="url(#nodeGlow)" />
        <rect
          x="5"
          y="4"
          width="50"
          height="44"
          rx="4"
          fill="#161b22"
          stroke="#3fb950"
          strokeWidth="1"
          opacity="0.9"
        />
        <rect x="10" y="10" width="40" height="8" rx="2" fill="#21262d" />
        <circle cx="42" cy="14" r="2.5" fill="#3fb950">
          <animate
            attributeName="opacity"
            values="1;0.4;1"
            dur="2s"
            begin="0.2s"
            repeatCount="indefinite"
          />
        </circle>
        <rect x="10" y="22" width="40" height="8" rx="2" fill="#21262d" />
        <circle cx="42" cy="26" r="2.5" fill="#3fb950">
          <animate
            attributeName="opacity"
            values="1;0.4;1"
            dur="2s"
            begin="0.5s"
            repeatCount="indefinite"
          />
        </circle>
        <rect x="10" y="34" width="40" height="8" rx="2" fill="#21262d" />
        <circle cx="42" cy="38" r="2.5" fill="#3fb950">
          <animate
            attributeName="opacity"
            values="1;0.4;1"
            dur="2s"
            begin="0.8s"
            repeatCount="indefinite"
          />
        </circle>
        <text
          x="30"
          y="61"
          fill="#8b949e"
          fontSize="8"
          fontFamily="monospace"
          textAnchor="middle">
          node-04
        </text>
      </g>

      {/* Connection line to right bottom node */}
      <line
        x1="340"
        y1="180"
        x2="420"
        y2="300"
        stroke="#3fb950"
        strokeWidth="0.8"
        opacity="0.4"
        strokeDasharray="4 3">
        <animate
          attributeName="strokeDashoffset"
          values="0;-7"
          dur="1s"
          begin="0.3s"
          repeatCount="indefinite"
        />
      </line>

      {/* Checkmark particles floating up */}
      <g filter="url(#glow)">
        <text
          x="120"
          y="175"
          fill="#3fb950"
          fontSize="12"
          fontFamily="monospace"
          opacity="0">
          ✓
          <animate
            attributeName="opacity"
            values="0;0.8;0"
            dur="4s"
            begin="1s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="y"
            values="175;155"
            dur="4s"
            begin="1s"
            repeatCount="indefinite"
          />
        </text>
        <text
          x="490"
          y="175"
          fill="#3fb950"
          fontSize="12"
          fontFamily="monospace"
          opacity="0">
          ✓
          <animate
            attributeName="opacity"
            values="0;0.8;0"
            dur="4s"
            begin="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="y"
            values="175;155"
            dur="4s"
            begin="2s"
            repeatCount="indefinite"
          />
        </text>
        <text
          x="180"
          y="285"
          fill="#3fb950"
          fontSize="12"
          fontFamily="monospace"
          opacity="0">
          ✓
          <animate
            attributeName="opacity"
            values="0;0.8;0"
            dur="4s"
            begin="3s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="y"
            values="285;265"
            dur="4s"
            begin="3s"
            repeatCount="indefinite"
          />
        </text>
        <text
          x="430"
          y="285"
          fill="#3fb950"
          fontSize="12"
          fontFamily="monospace"
          opacity="0">
          ✓
          <animate
            attributeName="opacity"
            values="0;0.8;0"
            dur="4s"
            begin="2.5s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="y"
            values="285;265"
            dur="4s"
            begin="2.5s"
            repeatCount="indefinite"
          />
        </text>
      </g>
    </svg>
  );
}

export default HeroSvg;
