import React, {useState} from 'react';

export default function InstallSection() {
  const [copied, setCopied] = useState(false);
  const installCmd = 'curl -sSL https://merchantprotocol.com/install | bash';

  const handleCopy = () => {
    navigator.clipboard.writeText(installCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        position: 'relative',
        padding: '8rem 3rem',
        background: '#0d1117',
        overflow: 'hidden',
      }}>
      {/* Radial glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100%',
          height: '100%',
          transform: 'translate(-50%, -50%)',
          background:
            'radial-gradient(circle, rgba(46,160,67,0.08) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          maxWidth: 900,
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}>
        {/* Section label */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            marginBottom: 24,
          }}>
          <span
            style={{
              flex: '0 1 60px',
              height: 1,
              background: 'linear-gradient(90deg, transparent, #3fb950)',
            }}
          />
          <span
            style={{
              fontFamily: "'JetBrains Mono', 'Courier New', monospace",
              fontSize: '0.65rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#6e7681',
            }}>
            Get Running in Seconds
          </span>
          <span
            style={{
              flex: '0 1 60px',
              height: 1,
              background: 'linear-gradient(90deg, #3fb950, transparent)',
            }}
          />
        </div>

        {/* Headline */}
        <h2
          style={{
            color: '#e6edf3',
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
            marginBottom: 16,
            lineHeight: 1.3,
          }}>
          Paste this into any server terminal.
        </h2>

        {/* Subtext */}
        <p
          style={{
            color: '#8b949e',
            fontFamily: "'JetBrains Mono', 'Courier New', monospace",
            fontSize: '0.85rem',
            marginBottom: 40,
            lineHeight: 1.6,
          }}>
          Protocol handles the rest — detection, installation, and
          configuration.
        </p>

        {/* Terminal */}
        <div
          style={{
            maxWidth: 620,
            margin: '0 auto',
            border: '1px solid #30363d',
            borderRadius: 10,
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)',
          }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              background: '#1c2128',
              borderBottom: '1px solid #30363d',
            }}>
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: '#ff5f57',
                marginRight: 8,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: '#febc2e',
                marginRight: 8,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: '#28c840',
                marginRight: 8,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                flex: 1,
                textAlign: 'center',
                color: '#8b949e',
                fontSize: '0.75rem',
                fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                letterSpacing: '0.05em',
              }}>
              terminal
            </span>
            <button
              onClick={handleCopy}
              title="Copy to clipboard"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 4,
                opacity: copied ? 1 : 0.4,
                transition: 'opacity 0.2s, filter 0.2s',
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.filter =
                  'drop-shadow(0 0 6px rgba(46,160,67,0.6))';
              }}
              onMouseLeave={e => {
                if (!copied) {
                  e.currentTarget.style.opacity = '0.4';
                }
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
          <div
            style={{
              padding: '24px 24px',
              background: '#0d1117',
              fontFamily: "'JetBrains Mono', 'Courier New', monospace",
              fontSize: '0.9rem',
              color: '#e6edf3',
              lineHeight: 1.6,
            }}>
            <code>
              <span style={{color: '#3fb950'}}>$</span> {installCmd}
            </code>
          </div>
        </div>

        {/* Platform badges */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 12,
            marginTop: 32,
            flexWrap: 'wrap',
          }}>
          {['Linux', 'macOS', 'Docker', 'WSL'].map(platform => (
            <span
              key={platform}
              style={{
                border: '1px solid #30363d',
                borderRadius: 20,
                padding: '6px 16px',
                color: '#8b949e',
                fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                fontSize: '0.75rem',
                letterSpacing: '0.05em',
              }}>
              {platform}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
