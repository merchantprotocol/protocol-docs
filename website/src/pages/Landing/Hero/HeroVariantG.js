import React, {useState, useEffect, useRef} from 'react';

/**
 * VARIANT G — "The Full Fleet"
 * Variant A's centered cinematic layout (headline, terminal, stats, CTA)
 * + Variant E's corner terminals (animated listener fleet)
 * + Variant F's node status indicators under the terminal
 * + Variant F's SVG connection lines from center to corners
 *
 * The central terminal drives the animation; corner nodes react.
 */

const NODE_NAMES = ['node-01', 'node-02', 'node-03', 'node-04'];
const SELF_HEAL_NODE = 2;
const NODE_DELAYS = [0, 300, 600, 200];

const keyframes = `
@keyframes heroGCursor {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
@keyframes heroGFloat1 {
  0%, 100% { transform: rotate(-6deg) scale(0.82) translateY(0px); }
  50% { transform: rotate(-6deg) scale(0.82) translateY(-8px); }
}
@keyframes heroGFloat2 {
  0%, 100% { transform: rotate(4deg) scale(0.85) translateY(0px); }
  50% { transform: rotate(4deg) scale(0.85) translateY(-6px); }
}
@keyframes heroGFloat3 {
  0%, 100% { transform: rotate(3deg) scale(0.78) translateY(0px); }
  50% { transform: rotate(3deg) scale(0.78) translateY(-10px); }
}
@keyframes heroGFloat4 {
  0%, 100% { transform: rotate(-5deg) scale(0.82) translateY(0px); }
  50% { transform: rotate(-5deg) scale(0.82) translateY(-5px); }
}
@keyframes heroGConnectionPulse {
  0% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: -16; }
}
@media (max-width: 900px) {
  .heroG-corner-terminal { display: none !important; }
  .heroG-connections { display: none !important; }
}
@media (max-width: 600px) {
  .heroG-headline { font-size: 2rem !important; }
}
`;

// ── Corner terminal component (from Variant E) ──

function MiniTerminal({name, lines, statusColor, opacity, style, className}) {
  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        width: '260px',
        background: '#161b22',
        border: `1px solid ${
          statusColor === '#3fb950'
            ? 'rgba(63,185,80,0.25)'
            : statusColor === '#f85149'
            ? 'rgba(248,81,73,0.25)'
            : '#30363d'
        }`,
        borderRadius: '8px',
        overflow: 'hidden',
        opacity,
        pointerEvents: 'none',
        transition: 'opacity 0.8s ease, border-color 0.5s ease',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        ...style,
      }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          padding: '6px 10px',
          background: '#1c2128',
          borderBottom: '1px solid #21262d',
        }}>
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: '#ff5f57',
            opacity: 0.7,
          }}
        />
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: '#febc2e',
            opacity: 0.7,
          }}
        />
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: '#28c840',
            opacity: 0.7,
          }}
        />
        <span
          style={{
            marginLeft: 'auto',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.55rem',
            color: '#6e7681',
            letterSpacing: '0.05em',
          }}>
          {name}
        </span>
      </div>
      <div
        style={{
          padding: '8px 10px',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.65rem',
          lineHeight: 1.7,
          minHeight: '70px',
        }}>
        {lines.map((line, i) => (
          <div
            key={i}
            style={{
              color: line.color,
              opacity: line.opacity || 1,
              whiteSpace: 'pre',
            }}>
            {line.text}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Node state for corner terminals ──

function getNodeLines(phase, nodeIndex) {
  const isSelfHeal = nodeIndex === SELF_HEAL_NODE;
  switch (phase) {
    case 'listening':
      return {
        lines: [
          {text: '$ protocol listen', color: '#3fb950'},
          {text: '  Waiting for deployments...', color: '#6e7681'},
          {text: '  █', color: '#3fb950'},
        ],
        statusColor: '#30363d',
      };
    case 'detected':
      return {
        lines: [
          {text: '$ protocol listen', color: '#3fb950'},
          {text: '  ● New deployment detected', color: '#56d364'},
          {text: '  Pulling v1.2.0...', color: '#8b949e'},
        ],
        statusColor: '#3fb950',
      };
    case 'pulling':
      return {
        lines: [
          {text: '  ● Pulling v1.2.0...', color: '#56d364'},
          {text: '  Downloading artifacts...', color: '#8b949e'},
          {text: '  ████████░░░░ 67%', color: '#3fb950'},
        ],
        statusColor: '#3fb950',
      };
    case 'healthCheck':
      if (isSelfHeal) {
        return {
          lines: [
            {text: '  ✗ Health check failed', color: '#f85149'},
            {text: '  Self-healing...', color: '#e3b341'},
            {text: '  Retrying deployment...', color: '#8b949e'},
          ],
          statusColor: '#f85149',
        };
      }
      return {
        lines: [
          {text: '  ████████████ 100%', color: '#3fb950'},
          {text: '  Running health checks...', color: '#8b949e'},
          {text: '  ✓ HTTP 200 OK', color: '#56d364'},
        ],
        statusColor: '#3fb950',
      };
    case 'healed':
      return {
        lines: [
          {text: '  ✓ Self-healed successfully', color: '#56d364'},
          {text: '  ✓ Health check passed', color: '#56d364'},
          {text: '  ✓ Deployment complete', color: '#3fb950'},
        ],
        statusColor: '#3fb950',
      };
    case 'complete':
      return {
        lines: [
          {text: '  ✓ Health check passed', color: '#56d364'},
          {text: '  ✓ Deployment complete', color: '#3fb950'},
          {text: '  Listening...', color: '#6e7681'},
        ],
        statusColor: '#3fb950',
      };
    default:
      return {
        lines: [
          {text: '$ protocol listen', color: '#3fb950'},
          {text: '  Waiting for deployments...', color: '#6e7681'},
        ],
        statusColor: '#30363d',
      };
  }
}

// ── Central terminal lines (synced with animation phases) ──

function getCentralLines(phase) {
  switch (phase) {
    case 'listening':
      return [{text: '$ protocol deploy', color: '#6e7681', opacity: 0.5}];
    case 'deploying':
      return [
        {text: '$ protocol deploy', color: '#3fb950'},
        {text: '  Deploying v1.2.0 to fleet...', color: '#8b949e'},
        {text: '  4 nodes listening', color: '#8b949e'},
      ];
    case 'detected':
    case 'pulling':
      return [
        {text: '$ protocol deploy', color: '#3fb950'},
        {text: '  Deploying v1.2.0 to fleet...', color: '#8b949e'},
        {text: '  4 nodes pulling...', color: '#e3b341'},
      ];
    case 'healthCheck':
      return [
        {text: '$ protocol deploy', color: '#3fb950'},
        {text: '  3/4 nodes healthy', color: '#8b949e'},
        {text: '  1 node self-healing...', color: '#e3b341'},
      ];
    case 'healed':
      return [
        {text: '$ protocol deploy', color: '#3fb950'},
        {text: '  4/4 nodes healthy', color: '#56d364'},
        {text: '  Confirming rollback points...', color: '#8b949e'},
      ];
    case 'complete':
      return [
        {text: '$ protocol deploy', color: '#3fb950'},
        {text: '  ✓ 4/4 nodes deployed (14.2s)', color: '#56d364'},
        {text: '  ✓ All health checks passed', color: '#56d364'},
        {text: '  ✓ Rollback points saved', color: '#56d364'},
      ];
    default:
      return [{text: '$ protocol deploy', color: '#3fb950'}];
  }
}

const cornerPositions = [
  {top: '12%', left: '12%', animation: 'heroGFloat1 6s ease-in-out infinite'},
  {top: '8%', right: '10%', animation: 'heroGFloat2 7s ease-in-out infinite'},
  {
    bottom: '12%',
    left: '14%',
    animation: 'heroGFloat3 8s ease-in-out infinite',
  },
  {
    bottom: '8%',
    right: '12%',
    animation: 'heroGFloat4 6.5s ease-in-out infinite',
  },
];

// ── Main Component ──

function HeroVariantG() {
  const [phase, setPhase] = useState('listening');
  const [nodePhases, setNodePhases] = useState([
    'listening',
    'listening',
    'listening',
    'listening',
  ]);
  const timeoutsRef = useRef([]);

  const clearAll = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };
  const later = (fn, ms) => {
    const t = setTimeout(fn, ms);
    timeoutsRef.current.push(t);
  };

  useEffect(() => {
    const run = () => {
      clearAll();
      setPhase('listening');
      setNodePhases(['listening', 'listening', 'listening', 'listening']);

      later(() => setPhase('deploying'), 2000);

      NODE_DELAYS.forEach((d, i) => {
        later(
          () =>
            setNodePhases(p => {
              const n = [...p];
              n[i] = 'detected';
              return n;
            }),
          3500 + d
        );
      });
      later(() => setPhase('detected'), 3500);

      NODE_DELAYS.forEach((d, i) => {
        later(
          () =>
            setNodePhases(p => {
              const n = [...p];
              n[i] = 'pulling';
              return n;
            }),
          5000 + d
        );
      });
      later(() => setPhase('pulling'), 5000);

      NODE_DELAYS.forEach((d, i) => {
        later(
          () =>
            setNodePhases(p => {
              const n = [...p];
              n[i] = 'healthCheck';
              return n;
            }),
          6800 + d
        );
      });
      later(() => setPhase('healthCheck'), 7000);

      later(() => {
        setNodePhases(p => {
          const n = [...p];
          n[SELF_HEAL_NODE] = 'healed';
          return n;
        });
        setPhase('healed');
      }, 8500);

      later(
        () => setNodePhases(['complete', 'complete', 'complete', 'complete']),
        9200
      );
      later(() => setPhase('complete'), 9500);

      later(() => run(), 13000);
    };

    run();
    return () => clearAll();
  }, []);

  const centralLines = getCentralLines(phase);
  const isActive = phase !== 'listening';

  return (
    <>
      <style>{keyframes}</style>
      <div
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '6rem 2rem 4rem',
          overflow: 'hidden',
          background: '#0d1117',
        }}>
        {/* Ambient glow */}
        <div
          style={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '800px',
            height: '800px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(46,160,67,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* ── Corner terminals (from Variant E) ── */}
        {NODE_NAMES.map((name, i) => {
          const {lines, statusColor} = getNodeLines(nodePhases[i], i);
          return (
            <MiniTerminal
              key={name}
              name={name}
              lines={lines}
              statusColor={statusColor}
              opacity={
                nodePhases[i] === 'listening'
                  ? 0.7
                  : nodePhases[i] === 'complete'
                  ? 0.75
                  : 0.9
              }
              className="heroG-corner-terminal"
              style={{
                ...cornerPositions[i],
                animation: cornerPositions[i].animation,
              }}
            />
          );
        })}

        {/* ── Connection lines (from Variant F) ── */}
        <svg
          className="heroG-connections"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 1,
          }}
          preserveAspectRatio="none">
          {isActive && (
            <g opacity="0.3">
              <line
                x1="50%"
                y1="50%"
                x2="22%"
                y2="22%"
                stroke="#3fb950"
                strokeWidth="1"
                strokeDasharray="8 8"
                style={{animation: 'heroGConnectionPulse 1.5s linear infinite'}}
              />
              <line
                x1="50%"
                y1="50%"
                x2="78%"
                y2="18%"
                stroke="#3fb950"
                strokeWidth="1"
                strokeDasharray="8 8"
                style={{
                  animation: 'heroGConnectionPulse 1.5s linear infinite',
                  animationDelay: '0.3s',
                }}
              />
              <line
                x1="50%"
                y1="50%"
                x2="24%"
                y2="78%"
                stroke="#3fb950"
                strokeWidth="1"
                strokeDasharray="8 8"
                style={{
                  animation: 'heroGConnectionPulse 1.5s linear infinite',
                  animationDelay: '0.6s',
                }}
              />
              <line
                x1="50%"
                y1="50%"
                x2="76%"
                y2="82%"
                stroke="#3fb950"
                strokeWidth="1"
                strokeDasharray="8 8"
                style={{
                  animation: 'heroGConnectionPulse 1.5s linear infinite',
                  animationDelay: '0.9s',
                }}
              />
            </g>
          )}
        </svg>

        {/* ── Content (Variant A layout) ── */}
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.65rem',
            fontWeight: 500,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#3fb950',
            marginBottom: '1.5rem',
            zIndex: 2,
          }}>
          Protocol Deployment Engine
        </div>

        <h1
          className="heroG-headline"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 900,
            fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
            lineHeight: 1.05,
            color: '#e6edf3',
            textAlign: 'center',
            maxWidth: '900px',
            margin: '0 0 1rem',
            zIndex: 2,
          }}>
          One Command.
          <br />
          <span
            style={{
              color: '#3fb950',
              fontStyle: 'italic',
              textShadow: '0 0 40px rgba(63, 185, 80, 0.4)',
            }}>
            Every Node.
          </span>
        </h1>

        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '1rem',
            lineHeight: 1.7,
            color: '#8b949e',
            textAlign: 'center',
            maxWidth: '600px',
            margin: '0 0 2.5rem',
            zIndex: 2,
          }}>
          Every node listens. One deploy command, and your entire fleet pulls
          the update autonomously. Self-healing. Zero downtime.
        </p>

        {/* ── Central terminal ── */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '640px',
            zIndex: 2,
          }}>
          <div
            style={{
              background: '#161b22',
              border: `1px solid ${
                phase === 'complete' ? 'rgba(63,185,80,0.4)' : '#30363d'
              }`,
              borderRadius: '10px',
              overflow: 'hidden',
              boxShadow:
                phase === 'complete'
                  ? '0 8px 32px rgba(0,0,0,0.4), 0 0 60px rgba(46,160,67,0.1)'
                  : '0 8px 32px rgba(0,0,0,0.4), 0 0 80px rgba(46,160,67,0.06)',
              transition: 'border-color 0.5s ease, box-shadow 0.5s ease',
            }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 14px',
                background: '#1c2128',
                borderBottom: '1px solid #30363d',
              }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: '#ff5f57',
                  opacity: 0.85,
                }}
              />
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: '#febc2e',
                  opacity: 0.85,
                }}
              />
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: '#28c840',
                  opacity: 0.85,
                }}
              />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.7rem',
                  color: '#6e7681',
                  marginLeft: 'auto',
                  letterSpacing: '0.05em',
                }}>
                protocol — deploy
              </span>
            </div>
            <div
              style={{
                padding: '16px 20px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.85rem',
                lineHeight: 1.8,
                minHeight: '140px',
              }}>
              {centralLines.map((line, i) => (
                <span
                  key={i}
                  style={{
                    color: line.color,
                    opacity: line.opacity || 1,
                    display: 'block',
                    whiteSpace: 'pre',
                  }}>
                  {line.text}
                </span>
              ))}
              {phase !== 'complete' && (
                <span
                  style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '16px',
                    background: '#3fb950',
                    animation: 'heroGCursor 1s step-end infinite',
                    verticalAlign: 'text-bottom',
                    marginLeft: '2px',
                  }}
                />
              )}
            </div>
          </div>

          {/* ── Node status indicators (from Variant F) ── */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              marginTop: '12px',
            }}>
            {NODE_NAMES.map((name, i) => {
              const p = nodePhases[i];
              const dotColor =
                p === 'healthCheck' && i === SELF_HEAL_NODE
                  ? '#f85149'
                  : p === 'listening'
                  ? '#6e7681'
                  : '#3fb950';
              const label =
                p === 'listening'
                  ? 'listening'
                  : p === 'detected'
                  ? 'detected'
                  : p === 'pulling'
                  ? 'pulling'
                  : p === 'healthCheck' && i === SELF_HEAL_NODE
                  ? 'healing'
                  : p === 'healthCheck'
                  ? 'checking'
                  : p === 'healed'
                  ? 'healed'
                  : p === 'complete'
                  ? 'deployed'
                  : 'idle';
              return (
                <div
                  key={name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 10px',
                    background: '#161b22',
                    border: '1px solid #21262d',
                    borderRadius: '6px',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.6rem',
                    color: '#6e7681',
                  }}>
                  <span
                    style={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      background: dotColor,
                      boxShadow:
                        dotColor === '#3fb950'
                          ? '0 0 6px rgba(63,185,80,0.5)'
                          : 'none',
                      transition: 'background 0.3s, box-shadow 0.3s',
                    }}
                  />
                  {name}
                  <span
                    style={{
                      marginLeft: 'auto',
                      color: dotColor,
                      fontSize: '0.55rem',
                    }}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── CTA buttons ── */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            marginTop: '2.5rem',
            zIndex: 2,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
          <a
            href="/getting-started"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 32px',
              background: '#2EA043',
              color: '#fff',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.85rem',
              fontWeight: 600,
              letterSpacing: '0.05em',
              borderRadius: '8px',
              border: 'none',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}>
            Get Started
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
          <a
            href="/overview"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 32px',
              background: 'transparent',
              color: '#e6edf3',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.85rem',
              fontWeight: 400,
              letterSpacing: '0.05em',
              borderRadius: '8px',
              border: '1px solid #30363d',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}>
            Read the Docs
          </a>
        </div>

        {/* ── Stats bar ── */}
        <div
          style={{
            display: 'flex',
            gap: '3rem',
            marginTop: '4rem',
            padding: '2rem 0',
            borderTop: '1px solid #21262d',
            zIndex: 2,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
          <div style={{textAlign: 'center'}}>
            <div
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: '2rem',
                fontWeight: 900,
                color: '#3fb950',
                lineHeight: 1,
              }}>
              20+
            </div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.65rem',
                color: '#6e7681',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                marginTop: '0.5rem',
              }}>
              Nodes Managed
            </div>
          </div>
          <div style={{textAlign: 'center'}}>
            <div
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: '2rem',
                fontWeight: 900,
                color: '#3fb950',
                lineHeight: 1,
              }}>
              &lt;60s
            </div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.65rem',
                color: '#6e7681',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                marginTop: '0.5rem',
              }}>
              Deploy Time
            </div>
          </div>
          <div style={{textAlign: 'center'}}>
            <div
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: '2rem',
                fontWeight: 900,
                color: '#3fb950',
                lineHeight: 1,
              }}>
              0
            </div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.65rem',
                color: '#6e7681',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                marginTop: '0.5rem',
              }}>
              Downtime
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HeroVariantG;
