import React, {useState} from 'react';

const features = [
  {
    num: '01',
    title: 'SOC 2 Ready',
    desc: 'Audit trails, encrypted secrets, and role-based access controls built into the deployment pipeline from day one.',
  },
  {
    num: '02',
    title: 'Secrets Encrypted at Rest',
    desc: 'Environment variables and credentials are AES-256 encrypted. They never touch disk in plaintext.',
  },
  {
    num: '03',
    title: 'Full Audit Trail',
    desc: 'Every deployment, rollback, and configuration change is logged with timestamps, user identity, and diff context.',
  },
  {
    num: '04',
    title: 'No Third-Party CI',
    desc: 'Your code never leaves your infrastructure. No external build servers, no shared runners, no supply-chain risk.',
  },
];

export default function SecurityCompliance() {
  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <div
      style={{
        padding: '8rem 3rem',
        background: '#0d1117',
        position: 'relative',
        overflow: 'hidden',
      }}>
      <div
        style={{
          maxWidth: 1000,
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
        }}>
        {/* Section label */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 48,
          }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', 'Courier New', monospace",
              fontSize: '0.65rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#6e7681',
            }}>
            Security &amp; Compliance
          </span>
          <span
            style={{
              flex: 1,
              height: 1,
              background:
                'linear-gradient(90deg, #3fb950 0%, transparent 100%)',
              opacity: 0.3,
            }}
          />
        </div>

        {/* Two-column layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4rem',
            alignItems: 'start',
          }}>
          {/* Left — headline + shield */}
          <div style={{position: 'sticky', top: '6rem'}}>
            <h2
              style={{
                color: '#e6edf3',
                fontSize: 'clamp(2.8rem, 6vw, 4.5rem)',
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 900,
                letterSpacing: '-0.03em',
                lineHeight: 1.0,
                marginBottom: 24,
              }}>
              SOC 2 ready
              <br />
              <span style={{color: '#3fb950'}}>out of the box</span>
            </h2>

            <p
              style={{
                color: '#8b949e',
                fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                fontSize: '0.85rem',
                lineHeight: 1.7,
                marginBottom: 40,
                maxWidth: 400,
              }}>
              Your deployments stay inside your infrastructure. No shared
              runners, no third-party access, no compliance gaps.
            </p>

            {/* Shield graphic */}
            <div style={{position: 'relative', width: 120, height: 140}}>
              <svg width="120" height="140" viewBox="0 0 120 140" fill="none">
                <path
                  d="M60 8L16 28V64C16 96 60 132 60 132S104 96 104 64V28L60 8Z"
                  stroke="#3fb950"
                  strokeWidth="1.5"
                  fill="rgba(46,160,67,0.05)"
                />
                <path
                  d="M46 68L56 78L76 58"
                  stroke="#3fb950"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: 200,
                  height: 200,
                  transform: 'translate(-50%, -50%)',
                  background:
                    'radial-gradient(circle, rgba(46,160,67,0.12) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>

          {/* Right — feature stack */}
          <div>
            {features.map((feat, i) => (
              <div
                key={i}
                onMouseEnter={() => setHoveredItem(i)}
                onMouseLeave={() => setHoveredItem(null)}
                style={{
                  padding: '28px 0',
                  borderBottom:
                    i < features.length - 1 ? '1px solid #21262d' : 'none',
                  transition: 'padding-left 0.3s ease',
                  paddingLeft: hoveredItem === i ? 12 : 0,
                }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 16,
                    marginBottom: 8,
                  }}>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                      fontSize: '0.7rem',
                      color: hoveredItem === i ? '#3fb950' : '#6e7681',
                      letterSpacing: '0.1em',
                      transition: 'color 0.3s ease',
                    }}>
                    {feat.num}
                  </span>
                  <h3
                    style={{
                      color: '#e6edf3',
                      fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                      fontSize: '1rem',
                      fontWeight: 600,
                      margin: 0,
                    }}>
                    {feat.title}
                  </h3>
                </div>
                <p
                  style={{
                    color: '#8b949e',
                    fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                    fontSize: '0.825rem',
                    lineHeight: 1.7,
                    margin: 0,
                    paddingLeft: 40,
                  }}>
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
