import React, {useState} from 'react';

/**
 * VARIANT B — "The Editorial Install"
 * Magazine-style two-column layout with the install command.
 * Left: editorial headline with glowing status dot.
 * Right: pull-quote, body copy, install terminal with copy-to-clipboard, platform badges.
 * Replaces the old InstallSection.
 */

const keyframes = `
@keyframes heroBReveal {
  0% { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes heroBLineGrow {
  0% { width: 0; }
  100% { width: 120px; }
}
@keyframes heroBPulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}
`;

const responsiveStyle = `
  @media (max-width: 900px) {
    .heroB-inner {
      grid-template-columns: 1fr !important;
      gap: 2rem !important;
      padding: 6rem 1.5rem !important;
      text-align: center;
    }
    .heroB-pullquote {
      border-left: none !important;
      padding-left: 0 !important;
      border-top: 3px solid #3fb950;
      padding-top: 1.5rem;
    }
    .heroB-cta {
      justify-content: center;
    }
    .heroB-badges {
      justify-content: center;
    }
  }
`;

const styles = {
  wrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    background: '#0d1117',
    overflow: 'hidden',
  },
  gridLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      linear-gradient(rgba(63,185,80,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(63,185,80,0.03) 1px, transparent 1px)
    `,
    backgroundSize: '80px 80px',
    pointerEvents: 'none',
  },
  inner: {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '8rem 3rem',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '4rem',
    alignItems: 'center',
    zIndex: 2,
    position: 'relative',
  },
  left: {},
  volume: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.6rem',
    fontWeight: 500,
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    color: '#6e7681',
    marginBottom: '2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  volumeDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#3fb950',
    boxShadow: '0 0 8px rgba(63, 185, 80, 0.6)',
    animation: 'heroBPulse 2s ease-in-out infinite',
  },
  headline: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontWeight: 900,
    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
    lineHeight: 1.05,
    color: '#e6edf3',
    margin: 0,
    letterSpacing: '-0.02em',
  },
  headlineItalic: {
    fontStyle: 'italic',
    color: '#3fb950',
    display: 'block',
    textShadow: '0 0 60px rgba(63, 185, 80, 0.3)',
  },
  greenRule: {
    height: '3px',
    background: '#3fb950',
    boxShadow: '0 0 12px rgba(46, 160, 67, 0.4)',
    margin: '2.5rem 0 0',
    animation: 'heroBLineGrow 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards',
    width: 0,
  },
  right: {},
  pullQuote: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontWeight: 700,
    fontStyle: 'italic',
    fontSize: '1.35rem',
    lineHeight: 1.5,
    color: '#e6edf3',
    borderLeft: '3px solid #3fb950',
    paddingLeft: '1.5rem',
    marginBottom: '1.5rem',
  },
  body: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.85rem',
    lineHeight: 1.8,
    color: '#8b949e',
    marginBottom: '2rem',
  },
  terminal: {
    border: '1px solid #30363d',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)',
    marginBottom: '1.5rem',
  },
  titleBar: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 14px',
    background: '#1c2128',
    borderBottom: '1px solid #30363d',
  },
  dot: color => ({
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: color,
    opacity: 0.85,
    marginRight: '6px',
    flexShrink: 0,
  }),
  titleBarLabel: {
    flex: 1,
    textAlign: 'center',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.7rem',
    color: '#6e7681',
    letterSpacing: '0.05em',
  },
  copyBtn: copied => ({
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    opacity: copied ? 1 : 0.4,
    transition: 'opacity 0.2s, filter 0.2s',
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  }),
  termBody: {
    padding: '20px 24px',
    background: '#0d1117',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.9rem',
    color: '#e6edf3',
    lineHeight: 1.6,
  },
  prompt: {
    color: '#3fb950',
  },
  badges: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  badge: {
    border: '1px solid #30363d',
    borderRadius: '20px',
    padding: '5px 14px',
    color: '#8b949e',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.7rem',
    letterSpacing: '0.05em',
  },
};

function HeroVariantB() {
  const [copied, setCopied] = useState(false);
  const installCmd = 'curl -sSL https://merchantprotocol.com/install | bash';

  const handleCopy = () => {
    navigator.clipboard.writeText(installCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <style>
        {keyframes}
        {responsiveStyle}
      </style>
      <div style={styles.wrapper}>
        <div style={styles.gridLines} />

        <div className="heroB-inner" style={styles.inner}>
          <div style={styles.left}>
            <div style={styles.volume}>
              <span style={styles.volumeDot} />
              <span>Protocol CLI · v1.2.0</span>
            </div>

            <h2 style={styles.headline}>
              Install Once.
              <br />
              <span style={styles.headlineItalic}>Run Everywhere.</span>
            </h2>

            <div style={styles.greenRule} />
          </div>

          <div className="heroB-right" style={styles.right}>
            <div className="heroB-pullquote" style={styles.pullQuote}>
              &ldquo;Paste this into any server terminal and Protocol handles
              the rest.&rdquo;
            </div>

            <p style={styles.body}>
              Detection, installation, and configuration — all automated. One
              curl command gets you up and running on any supported platform.
            </p>

            {/* Terminal with copy-to-clipboard */}
            <div style={styles.terminal}>
              <div style={styles.titleBar}>
                <span style={styles.dot('#ff5f57')} />
                <span style={styles.dot('#febc2e')} />
                <span style={styles.dot('#28c840')} />
                <span style={styles.titleBarLabel}>terminal</span>
                <button
                  onClick={handleCopy}
                  title="Copy to clipboard"
                  style={styles.copyBtn(copied)}
                  onMouseEnter={e => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.filter =
                      'drop-shadow(0 0 6px rgba(46,160,67,0.6))';
                  }}
                  onMouseLeave={e => {
                    if (!copied) e.currentTarget.style.opacity = '0.4';
                    e.currentTarget.style.filter = 'none';
                  }}>
                  {copied ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#3fb950"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#8b949e"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  )}
                </button>
              </div>
              <div style={styles.termBody}>
                <code>
                  <span style={styles.prompt}>$</span> {installCmd}
                </code>
              </div>
            </div>

            <div className="heroB-badges" style={styles.badges}>
              {['Linux', 'macOS', 'Docker', 'WSL'].map(platform => (
                <span key={platform} style={styles.badge}>
                  {platform}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HeroVariantB;
