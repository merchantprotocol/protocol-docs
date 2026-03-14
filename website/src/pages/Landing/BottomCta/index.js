import React from 'react';

export default function BottomCta() {
  return (
    <div
      style={{
        background: '#0d1117',
        padding: '8rem 3rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {/* Radial glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          height: '80%',
          background:
            'radial-gradient(circle, rgba(46,160,67,0.08) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 900,
          margin: '0 auto',
        }}>
        {/* Section label */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            marginBottom: 32,
          }}>
          <span
            style={{
              display: 'inline-block',
              width: 40,
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
            READY TO DEPLOY
          </span>
          <span
            style={{
              display: 'inline-block',
              width: 40,
              height: 1,
              background: 'linear-gradient(90deg, #3fb950, transparent)',
            }}
          />
        </div>

        {/* Headline */}
        <h2
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: '#e6edf3',
            marginBottom: 24,
          }}>
          Your infrastructure is waiting.
        </h2>

        {/* Body */}
        <p
          style={{
            fontFamily: "'JetBrains Mono', 'Courier New', monospace",
            color: '#8b949e',
            fontSize: '0.95rem',
            lineHeight: 1.7,
            maxWidth: 600,
            margin: '0 auto 40px',
          }}>
          One command connects your servers to your repository. Every node
          pulls, builds, and serves autonomously. No orchestrators. No middle
          layers. Just your code, running everywhere.
        </p>

        {/* Buttons */}
        <div
          style={{
            display: 'flex',
            gap: 16,
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: 48,
          }}>
          <a
            href="/getting-started"
            className="bottom-cta-button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '14px 32px',
              background: '#2EA043',
              color: '#ffffff',
              fontFamily: "'JetBrains Mono', 'Courier New', monospace",
              fontSize: '0.85rem',
              borderRadius: 8,
              letterSpacing: '0.05em',
              textDecoration: 'none',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}>
            Get Started
          </a>
          <a
            href="/overview"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '14px 32px',
              background: 'transparent',
              color: '#e6edf3',
              fontFamily: "'JetBrains Mono', 'Courier New', monospace",
              fontSize: '0.85rem',
              borderRadius: 8,
              letterSpacing: '0.05em',
              textDecoration: 'none',
              border: '1px solid #30363d',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}>
            Read the Docs
          </a>
        </div>

        {/* Green gradient divider */}
        <div
          style={{
            height: 1,
            background:
              'linear-gradient(90deg, transparent, #3fb950 20%, #3fb950 80%, transparent)',
            opacity: 0.3,
            marginBottom: 32,
          }}
        />

        {/* Stats row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 48,
            flexWrap: 'wrap',
          }}>
          {[
            {value: '20+', label: 'nodes'},
            {value: '< 60s', label: 'deploy'},
            {value: 'Zero', label: 'downtime'},
          ].map((stat, i) => (
            <span
              key={i}
              style={{
                fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                fontSize: '0.8rem',
                color: '#8b949e',
              }}>
              <span style={{color: '#3fb950', fontWeight: 700}}>
                {stat.value}
              </span>{' '}
              {stat.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
